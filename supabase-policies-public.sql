-- Allow anonymous (anon) users to read approved/active deals and approved merchant profiles
-- Run this in the Supabase SQL editor for your project

-- Deals: public read of approved, non-expired deals
CREATE POLICY IF NOT EXISTS "Public can view approved active deals"
  ON public.deals FOR SELECT
  TO anon
  USING (status = 'approved' AND end_date > now());

-- Merchant profiles: public read of approved merchants only
CREATE POLICY IF NOT EXISTS "Public can view approved merchants"
  ON public.merchant_profiles FOR SELECT
  TO anon
  USING (approval_status = 'approved');

-- Optional: allow public to read minimal profile info of merchants via join
-- Not strictly required if you already join deals -> merchant_profiles
-- CREATE POLICY IF NOT EXISTS "Public can read profiles for joins"
--   ON public.profiles FOR SELECT
--   TO anon
--   USING (true);

-- NOTE: If you want unauthenticated users to increment views_count safely,
-- prefer creating a SECURITY DEFINER RPC that only increments the column.
-- Example (create once and then call via supabase.rpc('increment_deal_views', { p_deal_id: '...' })):
--
-- CREATE OR REPLACE FUNCTION public.increment_deal_views(p_deal_id uuid)
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE public.deals
--   SET views_count = COALESCE(views_count, 0) + 1
--   WHERE id = p_deal_id AND status = 'approved';
-- END; $$;
--
-- REVOKE ALL ON FUNCTION public.increment_deal_views(uuid) FROM PUBLIC;
-- GRANT EXECUTE ON FUNCTION public.increment_deal_views(uuid) TO anon, authenticated;
