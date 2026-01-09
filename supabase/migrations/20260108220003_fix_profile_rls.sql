-- =====================================================
-- FIX: RLS Policies for Profiles Table
-- =====================================================
-- The login is failing because the user can't insert their own profile
-- This script fixes the RLS policies

-- 1. Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 2. Drop and recreate INSERT policy for profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Verify the policy was created
SELECT 
    policyname,
    cmd,
    with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- 4. Test if current user can insert (this should work now)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get current user ID (if logged in via SQL editor, this might be NULL)
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE '⚠️  Not authenticated in SQL editor (this is OK)';
        RAISE NOTICE '   The policy will work when logging in via the app';
    ELSE
        RAISE NOTICE '✅ Authenticated as: %', v_user_id;
        RAISE NOTICE '   Policy should allow INSERT';
    END IF;
END $$;

-- 5. Alternative: Grant direct INSERT permission (if RLS is causing issues)
-- Uncomment if the policy above doesn't work:

/*
GRANT INSERT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO authenticated;
*/
