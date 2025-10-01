import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
