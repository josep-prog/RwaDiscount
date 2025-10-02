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

-- Allow the public to read feedback rows (for like counts) but only for approved & active deals
CREATE POLICY IF NOT EXISTS "Public can read feedback for approved active deals"
  ON public.deal_feedback FOR SELECT
  TO anon
  USING (EXISTS (
    SELECT 1 FROM public.deals d
    WHERE d.id = deal_feedback.deal_id
      AND d.status = 'approved'
      AND d.end_date > now()
  ));

-- RPC to safely increment views for both guests and logged-in users
CREATE OR REPLACE FUNCTION public.increment_deal_views(p_deal_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.deals
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = p_deal_id AND status = 'approved';
END; $$;

REVOKE ALL ON FUNCTION public.increment_deal_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_deal_views(uuid) TO anon, authenticated;
