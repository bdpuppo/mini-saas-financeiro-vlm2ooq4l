-- Set up specific multi-tenant policies (Data Isolation)
DO $$
BEGIN
    -- 1. Create function to set created_by to auth.uid() automatically
    CREATE OR REPLACE FUNCTION public.set_created_by_uid()
    RETURNS trigger AS $func$
    BEGIN
      IF NEW.created_by IS NULL THEN
        NEW.created_by = auth.uid();
      END IF;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- 2. Clean up old permissive policies to enforce strict isolation
    DROP POLICY IF EXISTS "Allow read for all authenticated" ON public.financial_transactions;
    DROP POLICY IF EXISTS "financial_transactions_read_authenticated" ON public.financial_transactions;
    DROP POLICY IF EXISTS "financial_transactions_write_financeiro_admin" ON public.financial_transactions;
    DROP POLICY IF EXISTS "tenant_isolation_ft_select" ON public.financial_transactions;
    DROP POLICY IF EXISTS "tenant_isolation_ft_insert" ON public.financial_transactions;
    DROP POLICY IF EXISTS "tenant_isolation_ft_update" ON public.financial_transactions;
    DROP POLICY IF EXISTS "tenant_isolation_ft_delete" ON public.financial_transactions;

    -- 3. Create strict tenant isolation policies for financial_transactions
    CREATE POLICY "tenant_isolation_ft_select" ON public.financial_transactions FOR SELECT TO authenticated USING (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ft_insert" ON public.financial_transactions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ft_update" ON public.financial_transactions FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ft_delete" ON public.financial_transactions FOR DELETE TO authenticated USING (created_by = auth.uid());

    DROP TRIGGER IF EXISTS trg_set_created_by_ft ON public.financial_transactions;
    CREATE TRIGGER trg_set_created_by_ft BEFORE INSERT ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.set_created_by_uid();


    -- Clean up old permissive policies for accounts_payable
    DROP POLICY IF EXISTS "Allow read for all authenticated" ON public.accounts_payable;
    DROP POLICY IF EXISTS "accounts_payable_read_authenticated" ON public.accounts_payable;
    DROP POLICY IF EXISTS "accounts_payable_write_financeiro_admin" ON public.accounts_payable;
    DROP POLICY IF EXISTS "tenant_isolation_ap_select" ON public.accounts_payable;
    DROP POLICY IF EXISTS "tenant_isolation_ap_insert" ON public.accounts_payable;
    DROP POLICY IF EXISTS "tenant_isolation_ap_update" ON public.accounts_payable;
    DROP POLICY IF EXISTS "tenant_isolation_ap_delete" ON public.accounts_payable;

    CREATE POLICY "tenant_isolation_ap_select" ON public.accounts_payable FOR SELECT TO authenticated USING (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ap_insert" ON public.accounts_payable FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ap_update" ON public.accounts_payable FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ap_delete" ON public.accounts_payable FOR DELETE TO authenticated USING (created_by = auth.uid());

    DROP TRIGGER IF EXISTS trg_set_created_by_ap ON public.accounts_payable;
    CREATE TRIGGER trg_set_created_by_ap BEFORE INSERT ON public.accounts_payable FOR EACH ROW EXECUTE FUNCTION public.set_created_by_uid();


    -- Clean up old permissive policies for accounts_receivable
    DROP POLICY IF EXISTS "Allow read for all authenticated" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "accounts_receivable_read_authenticated" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "accounts_receivable_write_financeiro_admin" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "tenant_isolation_ar_select" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "tenant_isolation_ar_insert" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "tenant_isolation_ar_update" ON public.accounts_receivable;
    DROP POLICY IF EXISTS "tenant_isolation_ar_delete" ON public.accounts_receivable;

    CREATE POLICY "tenant_isolation_ar_select" ON public.accounts_receivable FOR SELECT TO authenticated USING (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ar_insert" ON public.accounts_receivable FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ar_update" ON public.accounts_receivable FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_ar_delete" ON public.accounts_receivable FOR DELETE TO authenticated USING (created_by = auth.uid());

    DROP TRIGGER IF EXISTS trg_set_created_by_ar ON public.accounts_receivable;
    CREATE TRIGGER trg_set_created_by_ar BEFORE INSERT ON public.accounts_receivable FOR EACH ROW EXECUTE FUNCTION public.set_created_by_uid();


    -- Clean up old permissive policies for activities
    DROP POLICY IF EXISTS "Allow read for all authenticated" ON public.activities;
    DROP POLICY IF EXISTS "activities_read_authenticated" ON public.activities;
    DROP POLICY IF EXISTS "activities_write_financeiro_admin" ON public.activities;
    DROP POLICY IF EXISTS "tenant_isolation_act_select" ON public.activities;
    DROP POLICY IF EXISTS "tenant_isolation_act_insert" ON public.activities;
    DROP POLICY IF EXISTS "tenant_isolation_act_update" ON public.activities;
    DROP POLICY IF EXISTS "tenant_isolation_act_delete" ON public.activities;

    CREATE POLICY "tenant_isolation_act_select" ON public.activities FOR SELECT TO authenticated USING (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_act_insert" ON public.activities FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_act_update" ON public.activities FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "tenant_isolation_act_delete" ON public.activities FOR DELETE TO authenticated USING (created_by = auth.uid());

    DROP TRIGGER IF EXISTS trg_set_created_by_act ON public.activities;
    CREATE TRIGGER trg_set_created_by_act BEFORE INSERT ON public.activities FOR EACH ROW EXECUTE FUNCTION public.set_created_by_uid();


    -- Ensure profiles are auto-created when an auth user is registered
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $func$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, role)
      VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'nome',
        COALESCE(NEW.raw_user_meta_data->>'role', 'financeiro')::public.app_role
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

END $$;

-- Update Views to strictly filter by created_by = auth.uid() ensuring RLS propagates through dashboards
DROP VIEW IF EXISTS public.v_financial_summary;
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
    WHERE created_by = auth.uid()
    GROUP BY transaction_date
) r
FULL OUTER JOIN (
    SELECT
        transaction_date AS date,
        SUM(CASE WHEN type = 'entrada' AND nature = 'previsto' THEN amount ELSE 0 END) AS entrada_prevista,
        SUM(CASE WHEN type = 'saida' AND nature = 'previsto' THEN amount ELSE 0 END) AS saida_prevista
    FROM public.financial_transactions
    WHERE created_by = auth.uid()
    GROUP BY transaction_date
) p ON r.date = p.date;

DROP VIEW IF EXISTS public.v_activity_summary;
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
WHERE created_by = auth.uid()
GROUP BY activity_date;

DROP VIEW IF EXISTS public.v_expenses_by_category;
CREATE OR REPLACE VIEW public.v_expenses_by_category AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.color AS category_color,
    SUM(t.amount) AS total_expense
FROM public.financial_transactions t
JOIN public.financial_categories c ON t.category_id = c.id
WHERE t.type = 'saida' AND t.created_by = auth.uid()
GROUP BY c.id, c.name, c.color;

-- Seed an Admin user to guarantee initial access
DO $SEED$
DECLARE
  new_admin_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'brunavia@gmail.com') THEN
    new_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_admin_id, '00000000-0000-0000-0000-000000000000', 'brunavia@gmail.com', crypt('Admin123!', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"nome": "Administrador"}', false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, full_name, role, is_active)
    VALUES (new_admin_id, 'brunavia@gmail.com', 'Administrador', 'admin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  ELSE
    UPDATE public.profiles SET role = 'admin' WHERE email = 'brunavia@gmail.com';
  END IF;
  
  -- Fallback test user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    new_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@example.com', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"nome": "Admin Example"}', false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, full_name, role, is_active)
    VALUES (new_admin_id, 'admin@example.com', 'Admin Example', 'admin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  ELSE
    UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
  END IF;
END $SEED$;
