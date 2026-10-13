-- =========================================================
-- PHOTOBOOK DATABASE SCHEMA & POLICIES
-- PostgreSQL / Supabase
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'photographer', 'admin')) DEFAULT 'customer',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. PHOTOGRAPHER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.photographer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  bio TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  travel_range_km INT DEFAULT 100,
  starting_price INT NOT NULL DEFAULT 8000,
  rating NUMERIC(3,2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  gear TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"English", "Hindi"}',
  honors TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 3,
  shoots_completed INT DEFAULT 20,
  hero_images TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{"Wedding", "Portrait"}',
  blackout_dates TEXT[] DEFAULT '{}'
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL,
  artist_count INT DEFAULT 0,
  image_url TEXT
);

-- 4. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  price INT NOT NULL,
  duration_hours INT NOT NULL,
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  turnaround_days INT NOT NULL DEFAULT 7,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 6. AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.photographer_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  reason TEXT,
  UNIQUE(photographer_id, date)
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE RESTRICT,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled', 'rejected')) DEFAULT 'pending',
  event_date DATE NOT NULL,
  event_time_start TEXT NOT NULL,
  event_time_end TEXT NOT NULL,
  duration_hours INT NOT NULL,
  event_type TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  guest_count INT NOT NULL DEFAULT 50,
  creative_notes TEXT,
  total_price INT NOT NULL,
  delivered_gallery_pin TEXT,
  delivered_photos_count INT,
  delivered_gallery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  is_read BOOLEAN DEFAULT false
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  creativity_rating NUMERIC(2,1) NOT NULL CHECK (creativity_rating >= 1 AND creativity_rating <= 5),
  punctuality_rating NUMERIC(2,1) NOT NULL CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  professionalism_rating NUMERIC(2,1) NOT NULL CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  comment TEXT NOT NULL,
  event_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 11. SAVED PHOTOGRAPHERS TABLE
CREATE TABLE IF NOT EXISTS public.saved_photographers (
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (customer_id, photographer_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_photographers ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for client & studio interactions
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all update profiles" ON public.profiles;
CREATE POLICY "Allow all update profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read photographer_profiles" ON public.photographer_profiles;
CREATE POLICY "Allow public read photographer_profiles" ON public.photographer_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow manage photographer_profiles" ON public.photographer_profiles;
CREATE POLICY "Allow manage photographer_profiles" ON public.photographer_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow manage categories" ON public.categories;
CREATE POLICY "Allow manage categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read packages" ON public.packages;
CREATE POLICY "Allow public read packages" ON public.packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow manage packages" ON public.packages;
CREATE POLICY "Allow manage packages" ON public.packages FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read portfolio_items" ON public.portfolio_items;
CREATE POLICY "Allow public read portfolio_items" ON public.portfolio_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow manage portfolio_items" ON public.portfolio_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage photographer_availability" ON public.photographer_availability;
CREATE POLICY "Allow manage photographer_availability" ON public.photographer_availability FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage bookings" ON public.bookings;
CREATE POLICY "Allow manage bookings" ON public.bookings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage messages" ON public.messages;
CREATE POLICY "Allow manage messages" ON public.messages FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage reviews" ON public.reviews;
CREATE POLICY "Allow manage reviews" ON public.reviews FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage notifications" ON public.notifications;
CREATE POLICY "Allow manage notifications" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow manage saved_photographers" ON public.saved_photographers;
CREATE POLICY "Allow manage saved_photographers" ON public.saved_photographers FOR ALL USING (true);

-- Grant privileges to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
