# PWA Icons

This directory should contain the following icon files for your PWA:

## Required Icons (create these from your logo):

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels) - **Required for PWA**
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels) - **Required for PWA**

## How to create these icons:

1. **Design your logo**: Create a high-resolution logo (at least 512x512px)
2. **Use icon generators**: Tools like:
   - [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon.io](https://favicon.io/)
3. **Design requirements**:
   - Use your brand colors
   - Make sure the icon works at small sizes
   - Consider using "safe areas" for maskable icons
   - Test on different backgrounds (light/dark)

## Quick Setup:
For now, you can use simple placeholder icons by running:
```bash
# Create simple colored squares as placeholders
convert -size 72x72 xc:'#2563eb' icon-72x72.png
convert -size 96x96 xc:'#2563eb' icon-96x96.png
convert -size 128x128 xc:'#2563eb' icon-128x128.png
convert -size 144x144 xc:'#2563eb' icon-144x144.png
convert -size 152x152 xc:'#2563eb' icon-152x152.png
convert -size 192x192 xc:'#2563eb' icon-192x192.png
convert -size 384x384 xc:'#2563eb' icon-384x384.png
convert -size 512x512 xc:'#2563eb' icon-512x512.png
```

Replace these with your actual branded icons once ready!
