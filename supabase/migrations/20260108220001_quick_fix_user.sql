-- =====================================================
-- QUICK FIX: Update existing user to admin role
-- =====================================================
-- Use this if you already have a user and just want to test login

-- =====================================================
-- OPTION 1: List all existing users
-- =====================================================
SELECT 
    email,
    id,
    email_confirmed_at,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- OPTION 2: Update existing user to admin role
-- =====================================================
-- Copy the email from the query above and paste it below

DO $$
DECLARE
    v_user_id UUID;
    v_email TEXT := 'admin@petcare.com'; -- CHANGE THIS to your actual email
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Create or update profile
        INSERT INTO profiles (id, role, full_name, phone)
        VALUES (
            v_user_id,
            'admin', -- Change to: admin, vet, assistant, receptionist, or client
            'Admin User',
            '787-520-6080'
        )
        ON CONFLICT (id) DO UPDATE
        SET 
            role = 'admin',
            full_name = 'Admin User',
            phone = '787-520-6080',
            updated_at = NOW();
        
        RAISE NOTICE '✅ SUCCESS: Profile created/updated for %', v_email;
        RAISE NOTICE '   User ID: %', v_user_id;
        RAISE NOTICE '   Role: admin';
        RAISE NOTICE '   You can now login with this email';
    ELSE
        RAISE NOTICE '❌ ERROR: User % not found in auth.users', v_email;
        RAISE NOTICE '   Please create the user first:';
        RAISE NOTICE '   1. Go to Supabase Dashboard';
        RAISE NOTICE '   2. Authentication → Users → Add User';
        RAISE NOTICE '   3. Email: %', v_email;
        RAISE NOTICE '   4. Password: password';
        RAISE NOTICE '   5. Auto Confirm Email: YES';
    END IF;
END $$;

-- =====================================================
-- OPTION 3: Verify profile was created
-- =====================================================
SELECT 
    u.email,
    u.id as user_id,
    p.role,
    p.full_name,
    p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- =====================================================
-- QUICK REFERENCE: Valid Roles
-- =====================================================
-- 'admin'        → Redirects to /dashboard (full access)
-- 'vet'          → Redirects to /dashboard (vet access)
-- 'assistant'    → Redirects to /dashboard (assistant access)
-- 'receptionist' → Redirects to /dashboard (receptionist access)
-- 'client'       → Redirects to /client (client portal)
