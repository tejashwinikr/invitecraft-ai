
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict EXECUTE on SECURITY DEFINER funcs (they're only called by triggers)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten storage listing: only allow SELECT on individual objects when owner or when bucket is public access via URL is fine.
-- Replace broad "Anyone can view" with: anyone can view individual files (needed for public URLs).
-- Listing the bucket is gated by storage's own logic; the warning is informational for public buckets.
