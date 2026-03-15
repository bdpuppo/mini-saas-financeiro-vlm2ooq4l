-- Resolve database permission errors (42501) for the activities table
-- Ensure basic table GRANTS are present for Supabase Auth roles
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.activities TO service_role;
GRANT SELECT ON TABLE public.activities TO anon;

-- Ensure RLS is enabled on the activities table
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Configure Role-Based Access Control policies
DO $$ 
BEGIN
    -- Drop existing policies to cleanly recreate them according to requirements
    DROP POLICY IF EXISTS "activities_read_authenticated" ON public.activities;
    DROP POLICY IF EXISTS "activities_write_financeiro_admin" ON public.activities;
    -- Drop the generic permissive policy if it exists so that role-based policies apply correctly
    DROP POLICY IF EXISTS "Allow read for all authenticated" ON public.activities;
    
    -- Policy: Read access for admin, financeiro, and diretoria
    CREATE POLICY "activities_read_authenticated" 
        ON public.activities 
        FOR SELECT 
        TO authenticated 
        USING (
            public.get_my_role() = ANY (ARRAY['admin'::public.app_role, 'financeiro'::public.app_role, 'diretoria'::public.app_role])
        );

    -- Policy: Write access (Insert, Update, Delete) for admin and financeiro
    CREATE POLICY "activities_write_financeiro_admin" 
        ON public.activities 
        FOR ALL 
        TO authenticated 
        USING (
            public.get_my_role() = ANY (ARRAY['admin'::public.app_role, 'financeiro'::public.app_role])
        )
        WITH CHECK (
            public.get_my_role() = ANY (ARRAY['admin'::public.app_role, 'financeiro'::public.app_role])
        );
END $$;
