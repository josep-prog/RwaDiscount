import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Image upload utilities
const BUCKET_NAME = 'deal-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  publicUrl: string;
  path: string;
}

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  
  return null;
};

export const uploadDealImage = async (file: File, userId: string): Promise<UploadResult> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Generate unique filename with user ID folder structure
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    publicUrl: urlData.publicUrl,
    path: data.path,
  };
};

export const deleteDealImage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error.message);
    // Don't throw error as this is often a cleanup operation
  }
};

export type UserRole = 'customer' | 'merchant' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string | null;
  business_category: string;
  business_location: string;
  business_phone: string;
  business_logo_url: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  category: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  location: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  views_count: number;
  saves_count: number;
  claims_count: number;
  created_at: string;
  updated_at: string;
}
