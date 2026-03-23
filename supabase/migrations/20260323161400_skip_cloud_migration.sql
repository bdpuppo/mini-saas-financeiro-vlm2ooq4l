-- Step 2: Data Migration
-- Create equivalent tables in Skip Cloud with same schema (simulated here for structural export)

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Export and Import all existing user records from Supabase into the new users table
DO $$
BEGIN
    INSERT INTO public.users (id, email, password_hash, name, created_at, updated_at, user_id)
    SELECT
        p.id,
        au.email,
        au.encrypted_password,
        p.full_name,
        p.created_at,
        p.updated_at,
        p.id
    FROM public.profiles p
    JOIN auth.users au ON p.id = au.id
    ON CONFLICT (id) DO NOTHING;
END $$;
