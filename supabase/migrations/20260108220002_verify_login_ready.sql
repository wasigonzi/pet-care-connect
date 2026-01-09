-- =====================================================
-- VERIFICATION: Check Login is Ready
-- =====================================================

-- 1. Check auth user exists
SELECT 
    'AUTH USER' as check_type,
    email,
    id,
    email_confirmed_at IS NOT NULL as email_confirmed,
    created_at
FROM auth.users
WHERE email = 'admin@petcare.com';

-- 2. Check profile exists with correct role
SELECT 
    'PROFILE' as check_type,
    id,
    role,
    full_name,
    created_at
FROM profiles
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@petcare.com');

-- 3. Check if everything is ready for login
DO $$
DECLARE
    v_user_exists BOOLEAN;
    v_profile_exists BOOLEAN;
    v_email_confirmed BOOLEAN;
    v_role TEXT;
BEGIN
    -- Check user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@petcare.com')
    INTO v_user_exists;
    
    -- Check email confirmed
    SELECT email_confirmed_at IS NOT NULL
    INTO v_email_confirmed
    FROM auth.users
    WHERE email = 'admin@petcare.com';
    
    -- Check profile exists
    SELECT EXISTS(
        SELECT 1 FROM profiles 
        WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@petcare.com')
    ) INTO v_profile_exists;
    
    -- Get role
    SELECT role INTO v_role
    FROM profiles
    WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@petcare.com');
    
    -- Report status
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'LOGIN READINESS CHECK';
    RAISE NOTICE '==============================================';
    
    IF v_user_exists THEN
        RAISE NOTICE '✅ User exists: admin@petcare.com';
    ELSE
        RAISE NOTICE '❌ User does NOT exist';
    END IF;
    
    IF v_email_confirmed THEN
        RAISE NOTICE '✅ Email confirmed';
    ELSE
        RAISE NOTICE '⚠️  Email NOT confirmed (may cause login issues)';
    END IF;
    
    IF v_profile_exists THEN
        RAISE NOTICE '✅ Profile exists';
        RAISE NOTICE '   Role: %', v_role;
        
        IF v_role = 'admin' THEN
            RAISE NOTICE '   Will redirect to: /dashboard';
        ELSIF v_role = 'client' THEN
            RAISE NOTICE '   Will redirect to: /client';
        ELSE
            RAISE NOTICE '   Will redirect to: /dashboard (staff role)';
        END IF;
    ELSE
        RAISE NOTICE '⚠️  Profile does NOT exist (will be auto-created on login)';
    END IF;
    
    RAISE NOTICE '==============================================';
    
    IF v_user_exists AND v_email_confirmed AND v_profile_exists THEN
        RAISE NOTICE '🎉 READY TO LOGIN!';
        RAISE NOTICE '   Email: admin@petcare.com';
        RAISE NOTICE '   Password: password';
        RAISE NOTICE '   Go to: http://localhost:3000/login';
    ELSE
        RAISE NOTICE '⚠️  NOT READY - Fix issues above';
    END IF;
    
    RAISE NOTICE '==============================================';
END $$;
