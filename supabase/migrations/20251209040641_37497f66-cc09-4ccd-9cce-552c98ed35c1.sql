-- Remove the duplicate INSERT policy on visitors table
DROP POLICY IF EXISTS "insert policy for anonymous users for their data collection" ON public.visitors;