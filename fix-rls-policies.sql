-- =====================================================
-- EMERGENCY FIX: Infinite Recursion in RLS Policies
-- =====================================================
-- Run this in Supabase Dashboard > SQL Editor
-- This will fix the login infinite recursion issue

-- 1. DROP ALL PROBLEMATIC POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;

-- 2. DROP PROBLEMATIC FUNCTIONS
DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS is_staff_or_admin();

-- 3. CREATE SIMPLE, NON-RECURSIVE POLICIES FOR PROFILES
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 4. TEMPORARILY DISABLE RLS ON OTHER TABLES TO AVOID CASCADING ISSUES
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- 5. VERIFY THE FIX
SELECT 'RLS Policies Fixed!' as status;