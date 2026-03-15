-- Update read access policies for operational tables to allow all authenticated users
-- maintaining strict write controls.
DO $$ 
BEGIN
    -- activities
    DROP POLICY IF EXISTS "activities_read_authenticated" ON public.activities;
    CREATE POLICY "activities_read_authenticated" 
        ON public.activities 
        FOR SELECT 
        TO authenticated 
        USING (true);

    -- accounts_receivable
    DROP POLICY IF EXISTS "accounts_receivable_read_authenticated" ON public.accounts_receivable;
    CREATE POLICY "accounts_receivable_read_authenticated" 
        ON public.accounts_receivable 
        FOR SELECT 
        TO authenticated 
        USING (true);

    -- accounts_payable
    DROP POLICY IF EXISTS "accounts_payable_read_authenticated" ON public.accounts_payable;
    CREATE POLICY "accounts_payable_read_authenticated" 
        ON public.accounts_payable 
        FOR SELECT 
        TO authenticated 
        USING (true);

    -- Ensure base tables for views also have explicit generic read policies for authenticated users
    DROP POLICY IF EXISTS "financial_transactions_read_authenticated" ON public.financial_transactions;
    CREATE POLICY "financial_transactions_read_authenticated" 
        ON public.financial_transactions 
        FOR SELECT 
        TO authenticated 
        USING (true);

    DROP POLICY IF EXISTS "cashflow_snapshots_read_authenticated" ON public.cashflow_snapshots;
    CREATE POLICY "cashflow_snapshots_read_authenticated" 
        ON public.cashflow_snapshots 
        FOR SELECT 
        TO authenticated 
        USING (true);

    DROP POLICY IF EXISTS "financial_categories_read_authenticated" ON public.financial_categories;
    CREATE POLICY "financial_categories_read_authenticated" 
        ON public.financial_categories 
        FOR SELECT 
        TO authenticated 
        USING (true);
        
    DROP POLICY IF EXISTS "cost_centers_read_authenticated" ON public.cost_centers;
    CREATE POLICY "cost_centers_read_authenticated" 
        ON public.cost_centers 
        FOR SELECT 
        TO authenticated 
        USING (true);

    DROP POLICY IF EXISTS "counterparties_read_authenticated" ON public.counterparties;
    CREATE POLICY "counterparties_read_authenticated" 
        ON public.counterparties 
        FOR SELECT 
        TO authenticated 
        USING (true);
END $$;

-- Update role check function to gracefully default to 'diretoria' (read-only perspective)
-- when a profile is not yet fully initialized or missing, rather than returning NULL.
-- This prevents authorization failures during data fetching.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(
        (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1),
        'diretoria'::public.app_role
    );
$$;
