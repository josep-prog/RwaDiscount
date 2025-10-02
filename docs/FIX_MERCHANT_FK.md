# Fix for merchant registration FK error (409) and rollout steps

The error you saw:

- insert or update on table "merchant_profiles" violates foreign key constraint "merchant_profiles_user_id_fkey"

Root cause
- merchant_profiles.user_id referenced profiles(id). If a user existed in auth.users but didn’t yet have a row in public.profiles (e.g., account created before the profile trigger was set up), inserting into merchant_profiles fails with a FK violation.

What this change does
1) Adds a backfill SQL to create any missing public.profiles rows for existing users and (re)ensures the on_auth_user_created trigger exists.
2) Changes the merchant_profiles.user_id foreign key to reference auth.users(id), which removes the runtime dependency on profiles existing first.
3) Improves the client error message so users get a helpful hint if this ever reappears.

How to apply in Supabase (once)
1) Backfill profiles
   - Open Supabase → SQL editor
   - Paste and run: database_migrations/2025-10-02-backfill-profiles.sql
2) Adjust foreign key
   - In the SQL editor, paste and run: database_migrations/2025-10-02-fix-merchant-profiles-fk.sql
3) Verify
   - Run a quick check:
     SELECT COUNT(*) AS missing_profiles
     FROM auth.users au LEFT JOIN public.profiles p ON p.id = au.id
     WHERE p.id IS NULL;
     -- Expect 0
   - Try merchant registration again from the app.

Notes
- Existing RLS policies continue to work because they rely on auth.uid() checks and not the profiles FK.
- We still keep profiles for user metadata and role; the FK change just makes merchant creation resilient.
- If you ever want to strictly require a profiles row, you can revert the FK back to profiles(id) after you are confident every user is always created via the trigger.
