-- Fix Security Issue #1: Remove dangerous INSERT policy on user_roles
-- This prevents privilege escalation where any user could grant themselves admin access
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_roles;

-- Fix Security Issue #2: Add INSERT policy for visitors table
-- This allows anonymous visitor tracking to function properly
CREATE POLICY "Allow anonymous visitor inserts" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);