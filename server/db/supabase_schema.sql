-- Run this entire script in your Supabase SQL Editor to create the necessary tables.

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text DEFAULT 'client'::text,
  fullName text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  phone text DEFAULT ''::text,
  dateOfBirth text DEFAULT ''::text,
  gender text DEFAULT ''::text,
  addresses jsonb DEFAULT '[]'::jsonb,
  wishlist jsonb DEFAULT '[]'::jsonb,
  cart jsonb DEFAULT '[]'::jsonb,
  createdAt timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  "mainCategory" text DEFAULT ''::text,
  "subCategory" text DEFAULT ''::text,
  material text DEFAULT ''::text,
  description text DEFAULT ''::text,
  "originalPrice" numeric DEFAULT 0.0,
  "salePrice" numeric DEFAULT 0.0,
  "primaryImage" text DEFAULT ''::text,
  "secondaryImage" text DEFAULT ''::text,
  "allImages" jsonb DEFAULT '[]'::jsonb,
  colors jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '[]'::jsonb,
  "saleLabel" text DEFAULT ''::text,
  "isBestSeller" boolean DEFAULT false,
  "isNewArrival" boolean DEFAULT false,
  stock integer DEFAULT 0,
  conversions integer DEFAULT 0,
  revenue numeric DEFAULT 0.0,
  createdAt timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. ORDERS TABLE
DROP TABLE IF EXISTS public.orders CASCADE;
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  subtotal numeric NOT NULL,
  tax numeric DEFAULT 0,
  "deliveryFee" numeric DEFAULT 0,
  status text DEFAULT 'pending'::text,
  "paymentMethod" text NOT NULL,
  "deliveryInfo" jsonb NOT NULL,
  "tracking" text DEFAULT ''::text,
  "createdAt" timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. LOGS TABLE
CREATE TABLE IF NOT EXISTS public.logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "user" text NOT NULL,
  action text NOT NULL,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. CMS TABLE (For storing sections, hero, seo)
CREATE TABLE IF NOT EXISTS public.cms (
  type text PRIMARY KEY,
  data jsonb DEFAULT '{}'::jsonb
);

-- RLS (Row Level Security) - We disable it for this proxy backend since the Node server uses the Service Role key to securely bypass RLS and handle logic manually via JWT.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms DISABLE ROW LEVEL SECURITY;
