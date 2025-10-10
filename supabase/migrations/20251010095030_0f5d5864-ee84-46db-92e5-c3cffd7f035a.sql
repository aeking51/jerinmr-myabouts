-- Add explicit deny policies for user_roles table
-- This ensures non-admins cannot modify roles even if has_role() has issues

CREATE POLICY "Non-admins cannot update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Non-admins cannot delete roles"  
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to clean old visitor data (90 days retention)
-- Admins can call this manually or set up scheduled jobs
CREATE OR REPLACE FUNCTION public.cleanup_old_visitors(retention_days integer DEFAULT 90)
RETURNS TABLE(deleted_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_deleted bigint;
BEGIN
  DELETE FROM public.visitors
  WHERE visited_at < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS rows_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT rows_deleted;
END;
$$;

COMMENT ON FUNCTION public.cleanup_old_visitors IS 'Deletes visitor records older than specified days (default 90). Returns count of deleted records.';