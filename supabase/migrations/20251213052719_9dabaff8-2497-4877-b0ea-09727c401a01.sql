-- Fix update_articles_updated_at() function to include search_path hardening
CREATE OR REPLACE FUNCTION public.update_articles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;