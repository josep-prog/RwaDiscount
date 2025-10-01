# Vercel Environment Variables Setup

## 🔧 Required: Set Environment Variables in Vercel Dashboard

Since you've deployed to Vercel, you may need to also set environment variables in the Vercel dashboard for production builds.

### Steps to Add Environment Variables:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: "rwa-discount" or similar
3. **Go to Settings** → **Environment Variables**
4. **Add these variables**:

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWJlcHlmaWtnbGh4bmxwY2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzIxMDgsImV4cCI6MjA3NDkwODEwOH0.EvF97FjTrom-9IGc2dfeB3pxQtm0-FvAceCX3lhoJ2c
Environment: Production

Name: VITE_SUPABASE_URL  
Value: https://xnybepyfikglhxnlpciv.supabase.co
Environment: Production

Name: VITE_APP_URL
Value: https://rwa-discount.vercel.app
Environment: Production
```

### Alternative: Automatic Detection

I've already included a `.env.production` file in your project, so Vercel should automatically use these values during production builds. However, if you encounter issues, manually adding them to the Vercel dashboard ensures they're available.

## 🔍 How to Verify:

After deployment, check that OAuth redirects use the correct URL:
- Development: `http://localhost:5173`
- Production: `https://rwa-discount.vercel.app`

## ✅ Both Methods Work:

1. **File-based** (what I've set up): `.env.production` file
2. **Dashboard-based** (optional): Vercel dashboard environment variables

Choose the method you prefer, or use both for redundancy.
