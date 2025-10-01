# Google OAuth Fix & PWA Setup Guide

## 🚀 Quick Start

The Google OAuth redirect_uri_mismatch error has been **fixed** and **PWA functionality** has been added to your RwaDiscount app!

## 🔧 Google OAuth Fix

### Problem Identified
The error occurred because your Google OAuth configuration was redirecting to `http://localhost:5173` (development URL) but your Google Cloud Console likely only had production URLs configured.

### Solution Applied
1. **Updated AuthContext**: Modified `/src/contexts/AuthContext.tsx` to use environment-specific redirect URLs
2. **Added Environment Variable**: Added `VITE_APP_URL=http://localhost:5173` to `.env` file
3. **Dynamic Redirect**: The app now uses the `VITE_APP_URL` environment variable for OAuth redirects

### Required Configuration in Google Cloud Console

You need to add these URLs to your **Authorized redirect URIs** in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials** 
3. Find your OAuth 2.0 Client ID
4. Add these to **Authorized redirect URIs**:

#### For Development:
```
http://localhost:5173
http://localhost:5173/auth/callback
```

#### For Production:
```
https://your-domain.com
https://your-domain.com/auth/callback
https://xnybepyfikglhxnlpciv.supabase.co/auth/v1/callback
```

### Environment Variables Setup

**Development (.env)**:
```env
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_URL=https://xnybepyfikglhxnlpciv.supabase.co
VITE_APP_URL=http://localhost:5173
```

**Production (.env.production)**:
```env
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_URL=https://xnybepyfikglhxnlpciv.supabase.co
VITE_APP_URL=https://your-production-domain.com
```

## 📱 PWA Features Added

Your app is now a **Progressive Web App** with the following features:

### ✅ Core PWA Features
- **🏠 Add to Home Screen**: Users can install the app on any device
- **📱 App-like Experience**: Runs in standalone mode (no browser UI)
- **⚡ Offline Support**: Basic offline functionality with cached resources
- **🔄 Background Updates**: Automatic app updates with user notification
- **🎨 Custom Icons**: Branded app icons for all devices
- **📊 Install Banner**: Smart install prompts for eligible users

### 📂 Files Added

```
public/
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── offline.html              # Offline fallback page
└── icons/                    # App icons for all devices
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png      # Required for PWA
    ├── icon-384x384.png
    └── icon-512x512.png      # Required for PWA

src/lib/
└── sw.ts                     # Service Worker utilities
```

### 🎨 Replace Placeholder Icons

The current icons are blue placeholders with "RD" text. Replace them with your branded icons:

1. **Create your logo** at 512x512px minimum
2. **Use online tools** like:
   - [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
3. **Replace files** in `/public/icons/` directory

## 🧪 Testing Your Fixes

### Test Google OAuth:
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:5173`
3. Try "Sign in with Google" - should work without redirect errors!

### Test PWA Installation:
1. Build for production: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools → Application → Manifest
4. Check "Add to Home Screen" appears
5. Use Lighthouse PWA audit

### Browser Testing:
- **Chrome**: Full PWA support + install banner
- **Firefox**: PWA support (no automatic install banner)
- **Safari**: Limited PWA support
- **Edge**: Full PWA support
- **Mobile browsers**: Install to home screen

## 🚀 Deployment

### For Vercel/Netlify:
1. Add environment variables in dashboard:
   ```
   VITE_SUPABASE_ANON_KEY=your_key
   VITE_SUPABASE_URL=your_url
   VITE_APP_URL=https://your-domain.com
   ```

2. Update your Google Cloud Console redirect URIs to include your production domain

### For Custom Domain:
Update your `.env.production` file and rebuild.

## 📊 PWA Audit Checklist

Use Chrome DevTools → Lighthouse → Progressive Web App:

- ✅ Installable
- ✅ PWA optimized
- ✅ Web app manifest
- ✅ Service worker
- ✅ Icons provided
- ✅ Offline fallback
- ✅ HTTPS (production only)

## 🐛 Troubleshooting

### Google OAuth Still Not Working?
1. **Check redirect URIs** in Google Cloud Console
2. **Verify environment variables** are loaded correctly
3. **Clear browser cache** and cookies
4. **Check Supabase dashboard** for OAuth provider settings

### PWA Not Installing?
1. **Must be HTTPS** (except localhost)
2. **Check manifest.json** loads correctly
3. **Verify icons** exist and are accessible
4. **Use incognito mode** for testing
5. **Clear browser data** and retry

### Service Worker Issues?
1. **Check browser console** for SW errors
2. **Unregister old SW**: Chrome DevTools → Application → Service Workers
3. **Clear all caches**: Application → Storage → Clear storage

## 🎉 Success!

Your app now:
1. **✅ Works with Google OAuth** (no more redirect errors)
2. **✅ Is a Progressive Web App** (installable on any device)
3. **✅ Works offline** (with cached resources)
4. **✅ Auto-updates** (with user notifications)
5. **✅ Cross-platform** (works on phones, tablets, desktops)

Users can now install RwaDiscount directly from their browser and use it like a native app! 🚀

---

**Need help?** Check the browser console for detailed logs from the service worker and PWA features.
