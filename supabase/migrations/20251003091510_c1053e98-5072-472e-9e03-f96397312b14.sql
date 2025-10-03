-- Drop the policy first (it depends on the function)
DROP POLICY IF EXISTS "Admins can read visitor data" ON public.visitors;

-- Now drop the trigger and functions
DROP TRIGGER IF EXISTS on_first_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.assign_first_user_as_admin();
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role public.app_role);

-- Drop the table and type
DROP TABLE IF EXISTS public.user_roles;
DROP TYPE IF EXISTS public.app_role;

-- Create simple policy for any authenticated user
CREATE POLICY "Authenticated users can read visitor data"
ON public.visitors
FOR SELECT
TO authenticated
USING (true);