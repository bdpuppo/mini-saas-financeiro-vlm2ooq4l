-- Set up roles functions
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid() LIMIT 1), false);
$$;

-- Create or Replace Views for Dashboard Metrics
CREATE OR REPLACE VIEW public.v_financial_summary AS
SELECT
    COALESCE(r.date, p.date) AS reference_date,
    COALESCE(r.entrada_realizada, 0) AS entrada_realizada,
    COALESCE(p.entrada_prevista, 0) AS entrada_prevista,
    COALESCE(r.saida_realizada, 0) AS saida_realizada,
    COALESCE(p.saida_prevista, 0) AS saida_prevista,
    (COALESCE(r.entrada_realizada, 0) - COALESCE(r.saida_realizada, 0)) AS saldo_transacoes
FROM (
    SELECT
        transaction_date AS date,
        SUM(CASE WHEN type = 'entrada' AND nature = 'realizado' THEN amount ELSE 0 END) AS entrada_realizada,
        SUM(CASE WHEN type = 'saida' AND nature = 'realizado' THEN amount ELSE 0 END) AS saida_realizada
    FROM public.financial_transactions
    GROUP BY transaction_date
) r
FULL OUTER JOIN (
    SELECT
        transaction_date AS date,
        SUM(CASE WHEN type = 'entrada' AND nature = 'previsto' THEN amount ELSE 0 END) AS entrada_prevista,
        SUM(CASE WHEN type = 'saida' AND nature = 'previsto' THEN amount ELSE 0 END) AS saida_prevista
    FROM public.financial_transactions
    GROUP BY transaction_date
) p ON r.date = p.date;

CREATE OR REPLACE VIEW public.v_activity_summary AS
SELECT
    activity_date AS reference_date,
    COUNT(CASE WHEN status = 'OK' THEN 1 END) AS atividades_ok,
    COUNT(CASE WHEN status = 'Andamento' THEN 1 END) AS atividades_andamento,
    COUNT(CASE WHEN status = 'Aguardando' THEN 1 END) AS atividades_aguardando,
    COUNT(CASE WHEN status = 'Parado' THEN 1 END) AS atividades_parado,
    COUNT(*) AS total_atividades,
    ROUND(COUNT(CASE WHEN status = 'OK' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS percentual_ok,
    ROUND(COUNT(CASE WHEN status = 'Andamento' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS percentual_em_andamento,
    ROUND(COUNT(CASE WHEN status = 'Parado' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS percentual_parado
FROM public.activities
GROUP BY activity_date;

CREATE OR REPLACE VIEW public.v_expenses_by_category AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.color AS category_color,
    SUM(t.amount) AS total_expense
FROM public.financial_transactions t
JOIN public.financial_categories c ON t.category_id = c.id
WHERE t.type = 'saida'
GROUP BY c.id, c.name, c.color;

CREATE OR REPLACE VIEW public.v_cash_breakpoint AS
SELECT
    reference_date AS rupture_date,
    projected_balance,
    CASE
        WHEN projected_balance < 0 THEN 'Alto'
        WHEN projected_balance < 1000 THEN 'Médio'
        ELSE 'Seguro'
    END AS risk_level
FROM public.cashflow_snapshots
WHERE projected_balance < 0
ORDER BY reference_date ASC
LIMIT 1;

-- Apply Row Level Security and Allow Read policy to all base tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        BEGIN
            EXECUTE format('CREATE POLICY "Allow read for all authenticated" ON public.%I FOR SELECT TO authenticated USING (true);', t);
        EXCEPTION WHEN duplicate_object THEN
            -- Ignore if policy already exists
        END;
    END LOOP;
END $$;
