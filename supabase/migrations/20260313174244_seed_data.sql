DO $$
DECLARE
  admin_id uuid;
  cat_rh uuid;
  cat_imp uuid;
  cat_forn uuid;
  cat_mkt uuid;
  cat_prod uuid;
  cat_serv uuid;
  cp_dist uuid;
  cp_cons uuid;
  cp_sup uuid;
  cp_ind uuid;
  cp_banco uuid;
  cc_adm uuid;
  cc_oper uuid;
  i int;
  curr_date date;
  v_amount numeric;
  v_status text;
  v_paid_date date;
  v_cat uuid;
  v_cp uuid;
  v_nature text;
BEGIN
  -- 1. User Setup
  SELECT id INTO admin_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'demo@example.com', crypt('password123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Demo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    
    INSERT INTO public.profiles (id, full_name, email, role, is_active)
    VALUES (admin_id, 'Admin Demo', 'demo@example.com', 'admin', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- 2. Financial Categories
  INSERT INTO public.financial_categories (name, type, color, description)
  VALUES 
    ('Recursos Humanos', 'saida', '#ef4444', 'Despesas com folha e benefícios'),
    ('Impostos', 'saida', '#f97316', 'Tributos e impostos'),
    ('Fornecedores', 'saida', '#eab308', 'Pagamento de fornecedores diversos'),
    ('Marketing', 'saida', '#ec4899', 'Despesas com publicidade'),
    ('Vendas de Produtos', 'entrada', '#22c55e', 'Receitas com vendas'),
    ('Serviços', 'entrada', '#3b82f6', 'Receitas de serviços prestados')
  ON CONFLICT ON CONSTRAINT uq_financial_categories_name_type DO NOTHING;

  SELECT id INTO cat_rh FROM public.financial_categories WHERE name = 'Recursos Humanos' AND type = 'saida' LIMIT 1;
  SELECT id INTO cat_imp FROM public.financial_categories WHERE name = 'Impostos' AND type = 'saida' LIMIT 1;
  SELECT id INTO cat_forn FROM public.financial_categories WHERE name = 'Fornecedores' AND type = 'saida' LIMIT 1;
  SELECT id INTO cat_mkt FROM public.financial_categories WHERE name = 'Marketing' AND type = 'saida' LIMIT 1;
  SELECT id INTO cat_prod FROM public.financial_categories WHERE name = 'Vendas de Produtos' AND type = 'entrada' LIMIT 1;
  SELECT id INTO cat_serv FROM public.financial_categories WHERE name = 'Serviços' AND type = 'entrada' LIMIT 1;

  -- 3. Counterparties
  IF NOT EXISTS (SELECT 1 FROM public.counterparties WHERE name = 'Distribuidora Logística') THEN
    INSERT INTO public.counterparties (type, name, is_active)
    VALUES 
      ('fornecedor', 'Distribuidora Logística', true),
      ('fornecedor', 'Consultoria RH', true),
      ('cliente', 'Supermercado Central', true),
      ('cliente', 'Indústria Metalúrgica', true),
      ('outro', 'Banco Regional', true);
  END IF;

  SELECT id INTO cp_dist FROM public.counterparties WHERE name = 'Distribuidora Logística' LIMIT 1;
  SELECT id INTO cp_cons FROM public.counterparties WHERE name = 'Consultoria RH' LIMIT 1;
  SELECT id INTO cp_sup FROM public.counterparties WHERE name = 'Supermercado Central' LIMIT 1;
  SELECT id INTO cp_ind FROM public.counterparties WHERE name = 'Indústria Metalúrgica' LIMIT 1;
  SELECT id INTO cp_banco FROM public.counterparties WHERE name = 'Banco Regional' LIMIT 1;

  -- 4. Cost Centers
  INSERT INTO public.cost_centers (name, description)
  VALUES 
    ('Administrativo', 'Sede administrativa'),
    ('Operacional', 'Operação principal')
  ON CONFLICT (name) DO NOTHING;

  SELECT id INTO cc_adm FROM public.cost_centers WHERE name = 'Administrativo' LIMIT 1;
  SELECT id INTO cc_oper FROM public.cost_centers WHERE name = 'Operacional' LIMIT 1;

  -- 5. Payables & Transactions
  IF NOT EXISTS (SELECT 1 FROM public.accounts_payable WHERE description = 'Despesa 1') THEN
    FOR i IN 1..15 LOOP
      curr_date := CURRENT_DATE + (i - 5) * 3;
      v_amount := 500 + (i * 150.50);
      
      IF i % 3 = 0 THEN
        v_cat := cat_rh; v_cp := cp_cons;
      ELSIF i % 3 = 1 THEN
        v_cat := cat_imp; v_cp := cp_banco;
      ELSE
        v_cat := cat_forn; v_cp := cp_dist;
      END IF;

      IF curr_date < CURRENT_DATE THEN
        IF i % 4 = 0 THEN
          v_status := 'vencido';
          v_paid_date := NULL;
          v_nature := 'previsto';
        ELSE
          v_status := 'pago';
          v_paid_date := curr_date + 1;
          v_nature := 'realizado';
        END IF;
      ELSE
        v_status := 'previsto';
        v_paid_date := NULL;
        v_nature := 'previsto';
      END IF;

      INSERT INTO public.accounts_payable (id, supplier_id, category_id, cost_center_id, description, amount, expected_date, paid_date, status, created_by)
      VALUES (gen_random_uuid(), v_cp, v_cat, cc_adm, 'Despesa ' || i, v_amount, curr_date, v_paid_date, v_status::payable_status, admin_id);

      INSERT INTO public.financial_transactions (id, transaction_date, type, nature, amount, category_id, counterparty_id, cost_center_id, description, created_by)
      VALUES (gen_random_uuid(), COALESCE(v_paid_date, curr_date), 'saida', v_nature::transaction_nature, v_amount, v_cat, v_cp, cc_adm, 'Despesa ' || i, admin_id);
    END LOOP;
  END IF;

  -- 6. Receivables & Transactions
  IF NOT EXISTS (SELECT 1 FROM public.accounts_receivable WHERE description = 'Receita 1') THEN
    FOR i IN 1..10 LOOP
      curr_date := CURRENT_DATE + (i - 3) * 4;
      v_amount := 1200 + (i * 300.75);
      
      IF i % 2 = 0 THEN
        v_cat := cat_prod; v_cp := cp_sup;
      ELSE
        v_cat := cat_serv; v_cp := cp_ind;
      END IF;

      IF curr_date < CURRENT_DATE THEN
        IF i % 3 = 0 THEN
          v_status := 'atrasado';
          v_paid_date := NULL;
          v_nature := 'previsto';
        ELSE
          v_status := 'recebido';
          v_paid_date := curr_date;
          v_nature := 'realizado';
        END IF;
      ELSE
        v_status := 'previsto';
        v_paid_date := NULL;
        v_nature := 'previsto';
      END IF;

      INSERT INTO public.accounts_receivable (id, customer_id, category_id, cost_center_id, description, amount, expected_date, received_date, status, created_by)
      VALUES (gen_random_uuid(), v_cp, v_cat, cc_oper, 'Receita ' || i, v_amount, curr_date, v_paid_date, v_status::receivable_status, admin_id);

      INSERT INTO public.financial_transactions (id, transaction_date, type, nature, amount, category_id, counterparty_id, cost_center_id, description, created_by)
      VALUES (gen_random_uuid(), COALESCE(v_paid_date, curr_date), 'entrada', v_nature::transaction_nature, v_amount, v_cat, v_cp, cc_oper, 'Receita ' || i, admin_id);
    END LOOP;
  END IF;

  -- 7. Operational Activities
  IF NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'Conferência de Estoque Diária' AND activity_date = CURRENT_DATE) THEN
    INSERT INTO public.activities (activity_date, title, status, percentage, created_by) VALUES
    (CURRENT_DATE, 'Conferência de Estoque Diária', 'OK', 100, admin_id),
    (CURRENT_DATE, 'Pagamento de Folha de Salários', 'Andamento', 60, admin_id),
    (CURRENT_DATE + 1, 'Reunião de Alinhamento Semanal', 'Aguardando', 0, admin_id),
    (CURRENT_DATE + 2, 'Envio de Notas Fiscais para Contabilidade', 'Parado', 10, admin_id),
    (CURRENT_DATE - 1, 'Conciliação Bancária', 'OK', 100, admin_id),
    (CURRENT_DATE - 2, 'Revisão de Inadimplência', 'OK', 100, admin_id),
    (CURRENT_DATE + 3, 'Aprovação de Orçamentos', 'Aguardando', 0, admin_id),
    (CURRENT_DATE + 4, 'Treinamento de Equipe', 'Aguardando', 0, admin_id);
  END IF;

  -- 8. Dashboard Visualization Data
  FOR i IN -30..15 LOOP
    curr_date := CURRENT_DATE + i;
    
    INSERT INTO public.cashflow_snapshots (
      reference_date, opening_balance, expected_inflows, realized_inflows, expected_outflows, realized_outflows, projected_balance, actual_balance
    ) VALUES (
      curr_date, 
      50000 + (i * 1000), 
      CASE WHEN i > 0 THEN 2000 ELSE 0 END, 
      CASE WHEN i <= 0 THEN 2000 + (i * 50) ELSE 0 END,
      CASE WHEN i > 0 THEN 1500 ELSE 0 END, 
      CASE WHEN i <= 0 THEN 1500 + (i * 30) ELSE 0 END,
      50000 + (i * 1000) + 500,
      CASE WHEN i <= 0 THEN 50000 + (i * 1000) + 500 ELSE 0 END
    ) ON CONFLICT (reference_date) DO NOTHING;
  END LOOP;

  -- Ensure rupture date scenario
  UPDATE public.cashflow_snapshots 
  SET projected_balance = -1500 
  WHERE reference_date = CURRENT_DATE + 10;

  INSERT INTO public.dashboard_metrics (metric_date, metric_name, metric_value, dimension) VALUES
  (CURRENT_DATE, 'Entradas', 25000.50, 'current_month'),
  (CURRENT_DATE, 'Saídas', 18000.00, 'current_month'),
  (CURRENT_DATE, 'Saldo', 7000.50, 'current_month')
  ON CONFLICT (metric_date, metric_name, dimension) DO NOTHING;

END $$;
