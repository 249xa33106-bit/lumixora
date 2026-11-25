-- ==============================================================================
-- LUMIXORA CAMPUS (campus.lumixora.in) - DEDICATED DATABASE SCHEMAS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/ykuyzkhhnltjccyzduap/sql
-- ==============================================================================

-- 1. CAMPUS SCHOLARS TABLE
CREATE TABLE IF NOT EXISTS public.campus_scholars (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    college_name TEXT NOT NULL,
    roll_number TEXT,
    department TEXT,
    branch TEXT,
    batch TEXT DEFAULT '2026',
    auth_provider TEXT DEFAULT 'otp',
    avatar TEXT,
    is_campus_verified BOOLEAN DEFAULT TRUE,
    is_fee_paid BOOLEAN DEFAULT FALSE,
    fee_amount NUMERIC(10, 2) DEFAULT 10.00,
    fee_tx_id TEXT,
    fee_paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant scholar lookup by email
CREATE INDEX IF NOT EXISTS idx_campus_scholars_email ON public.campus_scholars(email);
CREATE INDEX IF NOT EXISTS idx_campus_scholars_college ON public.campus_scholars(college_name);

-- 2. CAMPUS PAYMENTS TABLE (Dedicated ₹10 verification payments)
CREATE TABLE IF NOT EXISTS public.campus_payments (
    id TEXT PRIMARY KEY,
    scholar_email TEXT NOT NULL,
    scholar_name TEXT,
    college_name TEXT,
    roll_number TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'Razorpay', -- 'Razorpay', 'UPI', 'PhonePe', 'GPay'
    tx_id TEXT NOT NULL,
    utr_number TEXT,
    status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payments table
CREATE INDEX IF NOT EXISTS idx_campus_payments_email ON public.campus_payments(scholar_email);
CREATE INDEX IF NOT EXISTS idx_campus_payments_tx_id ON public.campus_payments(tx_id);
CREATE INDEX IF NOT EXISTS idx_campus_payments_created ON public.campus_payments(created_at DESC);

-- 3. CAMPUS READINESS TABLE (CRI Scores & Preparation Metrics)
CREATE TABLE IF NOT EXISTS public.campus_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholar_email TEXT UNIQUE NOT NULL,
    target_company TEXT DEFAULT 'tcs',
    total_score NUMERIC DEFAULT 74,
    tier TEXT DEFAULT 'Tier-1 Ready',
    aptitude_score NUMERIC DEFAULT 78,
    coding_score NUMERIC DEFAULT 72,
    interview_score NUMERIC DEFAULT 68,
    resume_score NUMERIC DEFAULT 85,
    streak_days INTEGER DEFAULT 3,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campus_readiness_email ON public.campus_readiness(scholar_email);

-- ENABLE ROW LEVEL SECURITY (RLS) WITH OPEN ACCESS FOR APP
ALTER TABLE public.campus_scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_readiness ENABLE ROW LEVEL SECURITY;

-- POLICIES (Allows reads and writes from the client app)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campus_scholars' AND policyname = 'Public Access campus_scholars') THEN
        CREATE POLICY "Public Access campus_scholars" ON public.campus_scholars FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campus_payments' AND policyname = 'Public Access campus_payments') THEN
        CREATE POLICY "Public Access campus_payments" ON public.campus_payments FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campus_readiness' AND policyname = 'Public Access campus_readiness') THEN
        CREATE POLICY "Public Access campus_readiness" ON public.campus_readiness FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;
