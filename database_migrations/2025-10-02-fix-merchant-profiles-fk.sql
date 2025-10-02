-- 2025-10-02 Change FK on merchant_profiles.user_id to reference auth.users(id)
-- This removes dependency on a pre-existing profiles row and prevents FK violations
-- when users exist in auth.users but their profile row has not yet been created.

BEGIN;

-- Drop old FK (to public.profiles) if present
ALTER TABLE public.merchant_profiles
  DROP CONSTRAINT IF EXISTS merchant_profiles_user_id_fkey;

-- Recreate FK referencing auth.users(id)
ALTER TABLE public.merchant_profiles
  ADD CONSTRAINT merchant_profiles_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

COMMIT;