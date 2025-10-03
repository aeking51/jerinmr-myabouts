-- 1) Create app_role enum if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

-- 2) Create user_roles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3) Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4) RLS policies for user_roles
-- Allow users to view their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END$$;

-- Allow users to insert their own roles only if they are already admin - prevent privilege escalation
-- Typically roles are managed by server-side only; we disallow client inserts/updates/deletes by default.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'No client-side writes to roles'
  ) THEN
    CREATE POLICY "No client-side writes to roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (false)
    WITH CHECK (false);
  END IF;
END$$;

-- 5) Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- 6) Harden visitors table policies: restrict SELECT to admins only
-- Drop overly-permissive public read policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'visitors' AND policyname = 'Allow reading visitor data'
  ) THEN
    DROP POLICY "Allow reading visitor data" ON public.visitors;
  END IF;
END$$;

-- Create admin-only SELECT policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'visitors' AND policyname = 'Admins can read visitor data'
  ) THEN
    CREATE POLICY "Admins can read visitor data"
    ON public.visitors
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- Preserve existing INSERT logging policy to allow anonymous inserts for analytics collection
-- Ensure there is an INSERT policy that allows anonymous writes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'visitors' AND policyname = 'Allow visitor logging'
  ) THEN
    CREATE POLICY "Allow visitor logging"
    ON public.visitors
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  ELSE
    -- Ensure the existing policy applies to anon as well
    ALTER POLICY "Allow visitor logging" ON public.visitors
    TO anon, authenticated;
  END IF;
END$$;