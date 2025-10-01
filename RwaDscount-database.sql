/*
  # RwaDiscount Platform - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for RwaDiscount, a discount discovery platform
  connecting customers with merchants offering deals in Rwanda.

  ## New Tables

  ### 1. `profiles`
  Extends Supabase auth.users with additional user information
  - `id` (uuid, FK to auth.users) - User ID
  - `email` (text) - User email
  - `full_name` (text) - Full name
  - `phone_number` (text) - Contact phone
  - `role` (text) - User role: 'customer', 'merchant', 'admin'
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `merchant_profiles`
  Additional information for merchant accounts
  - `id` (uuid, PK) - Merchant profile ID
  - `user_id` (uuid, FK to profiles) - Reference to user profile
  - `business_name` (text) - Official business name
  - `business_description` (text) - Description of business
  - `business_category` (text) - Type of business (restaurant, retail, etc.)
  - `business_location` (text) - Physical address/location
  - `business_phone` (text) - Business contact number
  - `business_logo_url` (text) - Business logo image
  - `approval_status` (text) - Status: 'pending', 'approved', 'rejected'
  - `approved_by` (uuid, FK to profiles) - Admin who approved
  - `approved_at` (timestamptz) - Approval timestamp
  - `rejection_reason` (text) - Reason if rejected
  - `created_at` (timestamptz) - Registration date
  - `updated_at` (timestamptz) - Last update

  ### 3. `deals`
  Discount offers posted by merchants
  - `id` (uuid, PK) - Deal ID
  - `merchant_id` (uuid, FK to merchant_profiles) - Merchant who posted
  - `title` (text) - Deal title
  - `description` (text) - Detailed description
  - `category` (text) - Product/service category
  - `original_price` (numeric) - Original price
  - `discounted_price` (numeric) - Price after discount
  - `discount_percentage` (integer) - Discount percentage
  - `location` (text) - Where deal can be claimed
  - `image_url` (text) - Deal image
  - `start_date` (timestamptz) - When deal becomes active
  - `end_date` (timestamptz) - When deal expires
  - `status` (text) - Status: 'pending', 'approved', 'rejected', 'expired'
  - `approved_by` (uuid, FK to profiles) - Admin who approved
  - `approved_at` (timestamptz) - Approval timestamp
  - `rejection_reason` (text) - Reason if rejected
  - `views_count` (integer) - Number of views
  - `saves_count` (integer) - Number of saves
  - `claims_count` (integer) - Number of claims
  - `created_at` (timestamptz) - Post date
  - `updated_at` (timestamptz) - Last update

  ### 4. `saved_deals`
  Customer saved deals for later viewing
  - `id` (uuid, PK) - Save record ID
  - `user_id` (uuid, FK to profiles) - Customer who saved
  - `deal_id` (uuid, FK to deals) - Deal that was saved
  - `created_at` (timestamptz) - When saved

  ### 5. `deal_feedback`
  Simple thumbs up/down feedback on deals
  - `id` (uuid, PK) - Feedback ID
  - `user_id` (uuid, FK to profiles) - Customer providing feedback
  - `deal_id` (uuid, FK to deals) - Deal being rated
  - `is_positive` (boolean) - True for thumbs up, false for thumbs down
  - `created_at` (timestamptz) - Feedback timestamp

  ### 6. `notifications`
  System notifications for users
  - `id` (uuid, PK) - Notification ID
  - `user_id` (uuid, FK to profiles) - Recipient
  - `type` (text) - Notification type
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `related_id` (uuid) - Related entity ID (deal, merchant, etc.)
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Notification timestamp

  ### 7. `notification_subscriptions`
  User preferences for receiving notifications
  - `id` (uuid, PK) - Subscription ID
  - `user_id` (uuid, FK to profiles) - Subscriber
  - `category` (text) - Category to receive notifications about
  - `email_enabled` (boolean) - Receive email notifications
  - `sms_enabled` (boolean) - Receive SMS notifications
  - `created_at` (timestamptz) - Subscription date

  ## Security
  - RLS enabled on all tables
  - Customers can read their own data and public deals
  - Merchants can manage their own business and deals
  - Admins have elevated permissions for moderation
  - Public can view approved, active deals

  ## Indexes
  - Optimized for common queries: deal browsing, filtering, search
  - Performance indexes on foreign keys and frequently queried columns
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'merchant', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create merchant_profiles table
CREATE TABLE IF NOT EXISTS merchant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_description text,
  business_category text NOT NULL,
  business_location text NOT NULL,
  business_phone text NOT NULL,
  business_logo_url text,
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchant_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  original_price numeric(10, 2) NOT NULL,
  discounted_price numeric(10, 2) NOT NULL,
  discount_percentage integer NOT NULL,
  location text NOT NULL,
  image_url text,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  rejection_reason text,
  views_count integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  claims_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (discounted_price < original_price),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create saved_deals table
CREATE TABLE IF NOT EXISTS saved_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, deal_id)
);

-- Create deal_feedback table
CREATE TABLE IF NOT EXISTS deal_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  is_positive boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, deal_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notification_subscriptions table
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_user_id ON merchant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_approval_status ON merchant_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_end_date ON deals(end_date);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_deals_user_id ON saved_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_deals_deal_id ON saved_deals(deal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for merchant_profiles
CREATE POLICY "Anyone can view approved merchant profiles"
  ON merchant_profiles FOR SELECT
  TO authenticated
  USING (approval_status = 'approved' OR user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Merchants can create their profile"
  ON merchant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can update own profile"
  ON merchant_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for deals
CREATE POLICY "Anyone can view approved active deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    (status = 'approved' AND end_date > now()) OR
    merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Approved merchants can create deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchant_profiles 
      WHERE user_id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Merchants can update own deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Merchants can delete own deals"
  ON deals FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for saved_deals
CREATE POLICY "Users can view own saved deals"
  ON saved_deals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save deals"
  ON saved_deals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved deals"
  ON saved_deals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for deal_feedback
CREATE POLICY "Users can view all feedback"
  ON deal_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feedback"
  ON deal_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON deal_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON deal_feedback FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notification_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON notification_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON notification_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON notification_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON notification_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON merchant_profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON merchant_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON deals;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();