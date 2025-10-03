-- Function to automatically assign admin role to the first user
CREATE OR REPLACE FUNCTION public.assign_first_user_as_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  -- Count existing users in user_roles
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- If this is the first user, assign admin role
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after a user signs up
DROP TRIGGER IF EXISTS on_first_user_created ON auth.users;
CREATE TRIGGER on_first_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_user_as_admin();