-- =====================================================
-- CLIENT PORTAL SYSTEM - PART 1: ENUM EXTENSION
-- =====================================================
-- This must run BEFORE the main migration
-- Adds 'client' value to existing user_role enum

-- Add 'client' to existing enum if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'client' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE 'client';
        RAISE NOTICE '✅ Added "client" value to user_role enum';
    ELSE
        RAISE NOTICE '✅ "client" value already exists in user_role enum';
    END IF;
END $$;

-- =====================================================
-- IMPORTANT: This migration MUST complete and commit
-- before running the next migration (part 2)
-- =====================================================
