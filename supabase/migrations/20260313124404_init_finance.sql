CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    entity TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    time TEXT,
    observations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.contas_receber AS
SELECT * FROM public.lancamentos WHERE type = 'entrada';

CREATE OR REPLACE VIEW public.contas_pagar AS
SELECT * FROM public.lancamentos WHERE type = 'saida';

DO $$
DECLARE
  new_user_id uuid;
  curr_date DATE := CURRENT_DATE - INTERVAL '15 days';
  end_date DATE := CURRENT_DATE + INTERVAL '15 days';
  i INT := 0;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );

  WHILE curr_date <= end_date LOOP
      INSERT INTO public.lancamentos (type, status, date, amount, entity, description, category)
      VALUES 
      ('entrada', CASE WHEN curr_date <= CURRENT_DATE THEN 'realizado' ELSE 'previsto' END, curr_date, 1000 + (RANDOM() * 500), 'Cliente ' || i, 'Serviço ' || i, 'Vendas'),
      ('saida', CASE WHEN curr_date <= CURRENT_DATE THEN 'realizado' ELSE 'previsto' END, curr_date, 200 + (RANDOM() * 100), 'Fornecedor ' || i, 'Material ' || i, 'Fornecedor'),
      ('saida', 'previsto', curr_date, 150 + (RANDOM() * 50), 'Impostos ' || i, 'DAS ' || i, 'Impostos');

      INSERT INTO public.atividades (date, title, status, observations)
      VALUES 
      (curr_date, 'Revisão Financeira ' || i, CASE WHEN curr_date <= CURRENT_DATE THEN 'ok' ELSE 'aguardando' END, CASE WHEN i % 2 = 0 THEN 'Tudo certo com os bancos' ELSE NULL END),
      (curr_date, 'Contato Cliente ' || i, 'andamento', 'Ligar a tarde após as 14h');

      curr_date := curr_date + INTERVAL '1 day';
      i := i + 1;
  END LOOP;
END $$;
