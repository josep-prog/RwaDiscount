# RwaDiscount improvements (public deals, image zoom, likes, and contact modal)

Follow these steps to enable the new behavior in your Supabase project and app.

1) Allow public/anonymous users to see approved deals and approved merchants
- Open supabase-policies-public.sql in your codebase.
- Copy its contents and run it in your Supabase SQL editor.
- This adds RLS policies to permit the anon role to SELECT:
  - approved, non-expired rows in public.deals
  - approved rows in public.merchant_profiles

2) (Optional but recommended) Safe view counter for anonymous visitors
- Create the increment_deal_views(...) function in the same SQL editor (see commented block in supabase-policies-public.sql).
- In the UI you can replace the direct update with:
  supabase.rpc('increment_deal_views', { p_deal_id: deal.id })

3) Storage bucket permissions
- Ensure the deal-images bucket is public or that public URLs are enabled for uploaded images.

4) New UX
- Deal cards now:
  - Use a consistent 16:9 aspect ratio (no awkward stretching)
  - Show a Find / Buy button for everyone
  - Open a modal with a zoomable image and merchant contact details
  - Logged-in customers can like (heart) and save
- Merchant dashboard now shows total Likes and per-deal likes

5) Environment variables
- Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env and on your hosting platform.
