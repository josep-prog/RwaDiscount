# RwaDiscount - Image Upload & Google OAuth Setup Guide

This guide walks you through setting up image upload functionality and Google OAuth for your RwaDiscount platform.

## 🖼️ Image Upload Feature Setup

### 1. Create Storage Bucket in Supabase

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **Storage** in the left sidebar

2. **Create the Bucket**
   - Click **"Create a new bucket"**
   - Bucket name: `deal-images`
   - Make it **Public** (check the public checkbox)
   - Click **Create bucket**

3. **Set Up Storage Policies (via SQL Editor)**
   
   Go to **SQL Editor** and run the contents of `supabase_storage_setup.sql`:

   ```sql
   -- Create storage bucket for deal images
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('deal-images', 'deal-images', true);

   -- Allow authenticated users to view all images (public read)
   CREATE POLICY "Public read access for deal images" ON storage.objects FOR SELECT 
   TO public 
   USING (bucket_id = 'deal-images');

   -- Allow merchants to upload images (authenticated users can insert)
   CREATE POLICY "Merchants can upload deal images" ON storage.objects FOR INSERT 
   TO authenticated 
   WITH CHECK (
     bucket_id = 'deal-images' 
     AND auth.role() = 'authenticated'
   );

   -- Allow merchants to update their own images
   CREATE POLICY "Merchants can update their deal images" ON storage.objects FOR UPDATE 
   TO authenticated 
   USING (bucket_id = 'deal-images' AND auth.uid()::text = (storage.foldername(name))[1])
   WITH CHECK (bucket_id = 'deal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Allow merchants to delete their own images
   CREATE POLICY "Merchants can delete their deal images" ON storage.objects FOR DELETE 
   TO authenticated 
   USING (bucket_id = 'deal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### 2. Test Image Upload Locally

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the feature:**
   - Sign in as a merchant
   - Go to Merchant Dashboard
   - Click "Create Deal"
   - Try uploading an image from your device
   - Verify the image appears in the preview
   - Submit the deal and check if it saves correctly

---

## 🔐 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" or "Google Identity"
   - Click **Enable**

3. **Create OAuth Credentials**
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Web application**
   - Name: `RwaDiscount App`

4. **Configure Authorized URLs**

   **For Local Development:**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/auth/callback`

   **For Production (Vercel):**
   - Authorized JavaScript origins: `https://your-app-name.vercel.app`
   - Authorized redirect URIs: `https://your-app-name.vercel.app/auth/callback`

5. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret**

### 2. Configure Supabase Authentication

1. **Access Supabase Dashboard**
   - Go to **Authentication** > **Providers**

2. **Configure Google Provider**
   - Find **Google** in the list
   - Toggle **Enable sign in with Google**
   - Enter your **Client ID** and **Client Secret**
   - Set **Redirect URL** to: `https://your-project-ref.supabase.co/auth/v1/callback`

3. **Update Site URL**
   - Go to **Authentication** > **Settings**
   - Set **Site URL** to:
     - Local: `http://localhost:5173`
     - Production: `https://your-app-name.vercel.app`

### 3. Test Google OAuth Locally

1. **Ensure your app is running:**
   ```bash
   npm run dev
   ```

2. **Test Google sign-in:**
   - Go to the sign-in page
   - Click "Continue with Google"
   - Complete the Google authentication flow
   - Verify you're redirected back to your app
   - Check that a profile is created in your `profiles` table

---

## 🚀 Vercel Deployment Configuration

### 1. Environment Variables

When deploying to Vercel, ensure these environment variables are set:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Google OAuth for Production

1. **Update Google Cloud Console:**
   - Add your Vercel domain to authorized origins: `https://your-app-name.vercel.app`
   - Add redirect URI: `https://your-app-name.vercel.app/auth/callback`

2. **Update Supabase:**
   - In Supabase Authentication settings
   - Update Site URL to your Vercel domain
   - The redirect URL stays the same (Supabase handles it)

### 3. Deploy to Vercel

1. **Connect your repository to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Or use the Vercel dashboard:**
   - Import your GitHub repository
   - Set environment variables
   - Deploy

### 4. Post-Deployment Checklist

- [ ] Google OAuth works on production domain
- [ ] Image uploads work and images are accessible
- [ ] All environment variables are set correctly
- [ ] Database migrations are applied
- [ ] Storage bucket policies are active

---

## 🔧 Troubleshooting

### Image Upload Issues

1. **"Bucket not found" error:**
   - Ensure you created the `deal-images` bucket
   - Check that it's set to public

2. **"Permission denied" error:**
   - Verify storage policies are created correctly
   - Check user is authenticated

3. **Images not loading:**
   - Ensure bucket is public
   - Check the public URL format

### Google OAuth Issues

1. **"Invalid redirect URI" error:**
   - Check authorized redirect URIs in Google Cloud Console
   - Ensure they match exactly (including https/http)

2. **"Invalid client" error:**
   - Verify Client ID and Secret in Supabase
   - Check they match Google Cloud Console credentials

3. **User not created in database:**
   - Check if the `handle_new_user()` trigger is working
   - Verify the trigger is enabled on auth.users table

---

## 📱 Mobile Testing

The image upload feature works on mobile devices:

- **iOS Safari:** Full support for camera and photo library
- **Android Chrome:** Full support for camera and photo library  
- **Mobile browsers:** File picker will show appropriate options

---

## 🔒 Security Notes

- Images are stored with user ID prefixes to prevent conflicts
- File type validation prevents malicious uploads
- 5MB size limit prevents server overload
- Storage policies ensure users can only delete their own images
- Google OAuth provides secure authentication without handling passwords

---

## Need Help?

If you encounter any issues during setup:

1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure Supabase policies and triggers are active
4. Test authentication flow step by step

The setup is complete! Your merchants can now upload images directly from their devices, and users can sign in securely with Google.
