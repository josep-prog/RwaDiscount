-- Create storage bucket for deal images
-- Run these commands in your Supabase SQL Editor

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-images', 'deal-images', true);

-- 2. Create storage policies

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
  -- You could add more specific merchant validation here if needed
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
