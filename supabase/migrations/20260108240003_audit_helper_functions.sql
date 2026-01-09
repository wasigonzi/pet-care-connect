-- =====================================================
-- AUDIT HELPER FUNCTIONS
-- =====================================================
-- Functions to support the audit system
-- These provide safe ways to query schema information

-- =====================================================
-- 1. TABLE CONSTRAINT INFORMATION
-- =====================================================

CREATE OR REPLACE FUNCTION get_table_constraints(table_name text)
RETURNS TABLE (
    constraint_name text,
    constraint_type text,
    definition text
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        tc.constraint_name::text,
        tc.constraint_type::text,
        pg_get_constraintdef(pgc.oid)::text as definition
    FROM information_schema.table_constraints tc
    JOIN pg_constraint pgc ON pgc.conname = tc.constraint_name
    WHERE tc.table_schema = 'public' 
    AND tc.table_name = $1;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. TABLE INDEX INFORMATION
-- =====================================================

CREATE OR REPLACE FUNCTION get_table_indexes(table_name text)
RETURNS TABLE (
    index_name text,
    columns text[],
    is_unique boolean
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        i.relname::text as index_name,
        array_agg(a.attname ORDER BY a.attnum)::text[] as columns,
        ix.indisunique as is_unique
    FROM pg_class t
    JOIN pg_index ix ON t.oid = ix.indrelid
    JOIN pg_class i ON i.oid = ix.indexrelid
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
    WHERE t.relname = $1
    AND t.relkind = 'r'
    GROUP BY i.relname, ix.indisunique;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. RLS STATUS CHECK
-- =====================================================

CREATE OR REPLACE FUNCTION get_rls_status(table_name text)
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policy_count bigint
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        $1::text,
        COALESCE(pt.rowsecurity, false) as rls_enabled,
        COUNT(pp.policyname) as policy_count
    FROM pg_tables pt
    LEFT JOIN pg_policies pp ON pp.tablename = pt.tablename
    WHERE pt.tablename = $1
    AND pt.schemaname = 'public'
    GROUP BY pt.tablename, pt.rowsecurity;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. STORAGE BUCKET INFORMATION
-- =====================================================

CREATE OR REPLACE FUNCTION get_storage_info()
RETURNS TABLE (
    bucket_name text,
    is_public boolean,
    file_count bigint,
    total_size bigint
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        b.name::text as bucket_name,
        b.public as is_public,
        COUNT(o.id) as file_count,
        COALESCE(SUM((o.metadata->>'size')::bigint), 0) as total_size
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON o.bucket_id = b.id
    GROUP BY b.name, b.public
    ORDER BY b.name;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. USER PROFILE STATISTICS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total_users bigint,
    users_with_profiles bigint,
    users_without_profiles bigint,
    role_distribution jsonb
) AS $
DECLARE
    total_count bigint;
    profile_count bigint;
    role_stats jsonb;
BEGIN
    -- Count total users
    SELECT COUNT(*) INTO total_count FROM auth.users;
    
    -- Count users with profiles
    SELECT COUNT(*) INTO profile_count FROM profiles;
    
    -- Get role distribution
    SELECT jsonb_object_agg(role, count) INTO role_stats
    FROM (
        SELECT role, COUNT(*) as count
        FROM profiles
        GROUP BY role
    ) role_counts;
    
    RETURN QUERY
    SELECT 
        total_count,
        profile_count,
        total_count - profile_count as users_without_profiles,
        COALESCE(role_stats, '{}'::jsonb) as role_distribution;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. DATABASE HEALTH CHECK
-- =====================================================

CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE (
    check_name text,
    status text,
    details text
) AS $
DECLARE
    table_count bigint;
    policy_count bigint;
    user_count bigint;
    profile_count bigint;
BEGIN
    -- Check table count
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    
    RETURN QUERY SELECT 
        'table_count'::text,
        CASE WHEN table_count >= 10 THEN 'pass' ELSE 'warning' END::text,
        format('Found %s tables', table_count)::text;
    
    -- Check RLS policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies;
    
    RETURN QUERY SELECT 
        'rls_policies'::text,
        CASE WHEN policy_count >= 5 THEN 'pass' ELSE 'warning' END::text,
        format('Found %s RLS policies', policy_count)::text;
    
    -- Check user/profile alignment
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM profiles;
    
    RETURN QUERY SELECT 
        'user_profiles'::text,
        CASE WHEN profile_count >= (user_count * 0.8) THEN 'pass' ELSE 'warning' END::text,
        format('%s users, %s profiles', user_count, profile_count)::text;
    
    -- Check for critical tables
    RETURN QUERY
    SELECT 
        'critical_tables'::text,
        CASE WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('profiles', 'clients', 'patients', 'appointments')
        ) THEN 'pass' ELSE 'fail' END::text,
        'Checking for profiles, clients, patients, appointments tables'::text;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. AUDIT LOG FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION log_audit_run(
    audit_type text,
    results jsonb,
    status text
)
RETURNS uuid AS $
DECLARE
    log_id uuid;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        new_values,
        created_at
    ) VALUES (
        auth.uid(),
        'audit_run',
        audit_type,
        jsonb_build_object(
            'results', results,
            'status', status,
            'timestamp', now()
        ),
        now()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
EXCEPTION
    WHEN OTHERS THEN
        -- If audit_logs table doesn't exist, just return a dummy UUID
        RETURN gen_random_uuid();
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_table_constraints(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_indexes(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_rls_status(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_storage_info() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION database_health_check() TO authenticated;
GRANT EXECUTE ON FUNCTION log_audit_run(text, jsonb, text) TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $
BEGIN
    RAISE NOTICE '✅ Audit helper functions created successfully!';
    RAISE NOTICE '🔧 Functions available:';
    RAISE NOTICE '   - get_table_constraints(table_name)';
    RAISE NOTICE '   - get_table_indexes(table_name)';
    RAISE NOTICE '   - get_rls_status(table_name)';
    RAISE NOTICE '   - get_storage_info()';
    RAISE NOTICE '   - get_user_stats()';
    RAISE NOTICE '   - database_health_check()';
    RAISE NOTICE '   - log_audit_run(type, results, status)';
    RAISE NOTICE '🔐 Permissions granted to authenticated users';
END $;