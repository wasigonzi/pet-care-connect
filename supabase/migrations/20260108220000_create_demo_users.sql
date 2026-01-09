-- =====================================================
-- CREATE DEMO USER PROFILES - FIXED VERSION
-- =====================================================
-- This script creates profiles for existing auth users
-- Run this AFTER creating users in Supabase Dashboard

-- =====================================================
-- STEP 1: Check which users exist
-- =====================================================
SELECT 
    email,
    id,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email IN ('admin@petcare.com', 'vet@petcare.com', 'client@petcare.com')
ORDER BY email;

-- =====================================================
-- STEP 2: Create profiles for existing users
-- =====================================================

-- Admin Profile (only if user exists)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'admin@petcare.com'
    LIMIT 1;

    -- Only create profile if user exists
    IF v_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, role, full_name, phone)
        VALUES (v_user_id, 'admin', 'Admin User', '787-520-6080')
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin',
            full_name = 'Admin User',
            phone = '787-520-6080',
            updated_at = NOW();
        
        RAISE NOTICE '✅ Created/Updated profile for admin@petcare.com';
    ELSE
        RAISE NOTICE '⚠️  User admin@petcare.com does not exist in auth.users';
    END IF;
END $$;

-- Vet Profile (only if user exists)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'vet@petcare.com'
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, role, full_name, phone)
        VALUES (v_user_id, 'vet', 'Dr. Veterinarian', '787-520-6081')
        ON CONFLICT (id) DO UPDATE
        SET role = 'vet',
            full_name = 'Dr. Veterinarian',
            phone = '787-520-6081',
            updated_at = NOW();
        
        RAISE NOTICE '✅ Created/Updated profile for vet@petcare.com';
    ELSE
        RAISE NOTICE '⚠️  User vet@petcare.com does not exist in auth.users';
    END IF;
END $$;

-- Client Profile (only if user exists)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'client@petcare.com'
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, role, full_name, phone)
        VALUES (v_user_id, 'client', 'Test Client', '787-466-6486')
        ON CONFLICT (id) DO UPDATE
        SET role = 'client',
            full_name = 'Test Client',
            phone = '787-466-6486',
            updated_at = NOW();
        
        RAISE NOTICE '✅ Created/Updated profile for client@petcare.com';
    ELSE
        RAISE NOTICE '⚠️  User client@petcare.com does not exist in auth.users';
    END IF;
END $$;

-- =====================================================
-- STEP 3: Verify profiles were created
-- =====================================================
SELECT 
    u.email,
    p.role,
    p.full_name,
    p.phone,
    p.created_at
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@petcare.com', 'vet@petcare.com', 'client@petcare.com')
ORDER BY p.role;

-- =====================================================
-- ALTERNATIVE: Create profile for ANY existing user
-- =====================================================
-- If you want to use a different email, run this:
-- Replace 'your-email@example.com' with your actual email

/*
DO $$
DECLARE
    v_user_id UUID;
    v_email TEXT := 'your-email@example.com'; -- CHANGE THIS
    v_role user_role := 'admin'; -- CHANGE THIS (admin, vet, assistant, receptionist, client)
BEGIN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, role, full_name, phone)
        VALUES (v_user_id, v_role, 'Your Name', '787-520-6080')
        ON CONFLICT (id) DO UPDATE
        SET role = v_role,
            updated_at = NOW();
        
        RAISE NOTICE '✅ Created/Updated profile for %', v_email;
    ELSE
        RAISE NOTICE '❌ User % does not exist in auth.users', v_email;
        RAISE NOTICE 'Create the user first in Supabase Dashboard → Authentication → Users';
    END IF;
END $$;
*/

-- =====================================================
-- INSTRUCTIONS IF USERS DON'T EXIST
-- =====================================================
-- 1. Go to Supabase Dashboard
-- 2. Navigate to: Authentication → Users
-- 3. Click "Add User" → "Create new user"
-- 4. For each user:
--    - Email: admin@petcare.com (or vet@, client@)
--    - Password: password
--    - Auto Confirm Email: ✅ YES (important!)
-- 5. Then run this script again
