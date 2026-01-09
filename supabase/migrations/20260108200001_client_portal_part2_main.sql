-- =====================================================
-- CLIENT PORTAL SYSTEM - PART 2: MAIN MIGRATION
-- =====================================================
-- PREREQUISITE: Part 1 must be run and committed first!
-- This creates tables, policies, and functions
-- UPDATED: Uses correct column names (client_id instead of owner_id)

-- =====================================================
-- 1. PROFILES TABLE (User metadata and roles)
-- =====================================================
-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add columns if they don't exist
DO $$
BEGIN
    -- Add role column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role user_role NOT NULL DEFAULT 'client';
    END IF;
    
    -- Add full_name column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
    
    -- Add phone column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    
    -- Add avatar_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    -- Add created_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =====================================================
-- 2. ADD user_id TO CLIENTS TABLE
-- =====================================================
DO $$ 
BEGIN
    -- Only add if clients table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        -- Add user_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'clients' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE clients ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- =====================================================
-- 3. ENABLE RLS (only on existing tables)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients') THEN
        ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
        ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communications') THEN
        ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- 4. DROP EXISTING POLICIES (for idempotency)
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        DROP POLICY IF EXISTS "Clients can view own record" ON clients;
        DROP POLICY IF EXISTS "Clients can update own record" ON clients;
        DROP POLICY IF EXISTS "Staff can view all clients" ON clients;
        DROP POLICY IF EXISTS "Staff can manage clients" ON clients;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients') THEN
        DROP POLICY IF EXISTS "Clients can view own pets" ON patients;
        DROP POLICY IF EXISTS "Clients can create own pets" ON patients;
        DROP POLICY IF EXISTS "Clients can update own pets" ON patients;
        DROP POLICY IF EXISTS "Staff can view all pets" ON patients;
        DROP POLICY IF EXISTS "Staff can manage all pets" ON patients;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        DROP POLICY IF EXISTS "Clients can view own appointments" ON appointments;
        DROP POLICY IF EXISTS "Clients can create own appointments" ON appointments;
        DROP POLICY IF EXISTS "Clients can update own appointments" ON appointments;
        DROP POLICY IF EXISTS "Staff can view all appointments" ON appointments;
        DROP POLICY IF EXISTS "Staff can manage all appointments" ON appointments;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
        DROP POLICY IF EXISTS "Clients can view own invoices" ON invoices;
        DROP POLICY IF EXISTS "Staff can view all invoices" ON invoices;
        DROP POLICY IF EXISTS "Staff can manage all invoices" ON invoices;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communications') THEN
        DROP POLICY IF EXISTS "Clients can view own communications" ON communications;
        DROP POLICY IF EXISTS "Staff can view all communications" ON communications;
        DROP POLICY IF EXISTS "Staff can manage all communications" ON communications;
    END IF;
END $$;

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get user role (safe version)
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = user_id LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Function to check if user is staff/admin
-- Maps: admin=admin, vet/assistant/receptionist=staff
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'vet', 'assistant', 'receptionist')
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =====================================================
-- 6. RLS POLICIES - PROFILES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Staff and admin can view all profiles
CREATE POLICY "Staff can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) IN ('admin', 'vet', 'assistant', 'receptionist')
    OR auth.uid() = id
);

-- =====================================================
-- 7. RLS POLICIES - CLIENTS (if table exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        
        -- Clients can view their own client record
        EXECUTE 'CREATE POLICY "Clients can view own record"
        ON clients FOR SELECT
        TO authenticated
        USING (user_id = auth.uid() OR is_staff_or_admin())';
        
        -- Clients can update their own client record
        EXECUTE 'CREATE POLICY "Clients can update own record"
        ON clients FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid() OR is_staff_or_admin())';
        
        -- Staff/admin can manage all clients
        EXECUTE 'CREATE POLICY "Staff can manage clients"
        ON clients FOR ALL
        TO authenticated
        USING (is_staff_or_admin())';
        
    END IF;
END $$;

-- =====================================================
-- 8. RLS POLICIES - PATIENTS (if table exists)
-- NOTE: Uses client_id column (not owner_id)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients') THEN
        
        -- Clients can view their own pets
        EXECUTE 'CREATE POLICY "Clients can view own pets"
        ON patients FOR SELECT
        TO authenticated
        USING (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Clients can create pets for themselves
        EXECUTE 'CREATE POLICY "Clients can create own pets"
        ON patients FOR INSERT
        TO authenticated
        WITH CHECK (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Clients can update their own pets
        EXECUTE 'CREATE POLICY "Clients can update own pets"
        ON patients FOR UPDATE
        TO authenticated
        USING (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Staff/admin can manage all pets
        EXECUTE 'CREATE POLICY "Staff can manage all pets"
        ON patients FOR ALL
        TO authenticated
        USING (is_staff_or_admin())';
        
    END IF;
END $$;

-- =====================================================
-- 9. RLS POLICIES - APPOINTMENTS (if table exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        
        -- Clients can view their own appointments
        EXECUTE 'CREATE POLICY "Clients can view own appointments"
        ON appointments FOR SELECT
        TO authenticated
        USING (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Clients can create appointments for themselves
        EXECUTE 'CREATE POLICY "Clients can create own appointments"
        ON appointments FOR INSERT
        TO authenticated
        WITH CHECK (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Clients can update their own appointments (limited)
        EXECUTE 'CREATE POLICY "Clients can update own appointments"
        ON appointments FOR UPDATE
        TO authenticated
        USING (
            (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
             AND status IN (''scheduled'', ''confirmed''))
            OR is_staff_or_admin()
        )';
        
        -- Staff/admin can manage all appointments
        EXECUTE 'CREATE POLICY "Staff can manage all appointments"
        ON appointments FOR ALL
        TO authenticated
        USING (is_staff_or_admin())';
        
    END IF;
END $$;

-- =====================================================
-- 10. RLS POLICIES - INVOICES (if table exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
        
        -- Clients can view their own invoices
        EXECUTE 'CREATE POLICY "Clients can view own invoices"
        ON invoices FOR SELECT
        TO authenticated
        USING (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Staff/admin can manage all invoices
        EXECUTE 'CREATE POLICY "Staff can manage all invoices"
        ON invoices FOR ALL
        TO authenticated
        USING (is_staff_or_admin())';
        
    END IF;
END $$;

-- =====================================================
-- 11. RLS POLICIES - COMMUNICATIONS (if table exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communications') THEN
        
        -- Clients can view communications sent to them
        EXECUTE 'CREATE POLICY "Clients can view own communications"
        ON communications FOR SELECT
        TO authenticated
        USING (
            client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
            OR is_staff_or_admin()
        )';
        
        -- Staff/admin can manage all communications
        EXECUTE 'CREATE POLICY "Staff can manage all communications"
        ON communications FOR ALL
        TO authenticated
        USING (is_staff_or_admin())';
        
    END IF;
END $$;

-- =====================================================
-- 12. TRIGGERS
-- =====================================================

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients') THEN
        CREATE INDEX IF NOT EXISTS idx_patients_client_id ON patients(client_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
        CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communications') THEN
        CREATE INDEX IF NOT EXISTS idx_communications_client_id ON communications(client_id);
    END IF;
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Client Portal migration completed successfully!';
    RAISE NOTICE '📊 Profiles table: READY';
    RAISE NOTICE '🔐 RLS policies: ACTIVE';
    RAISE NOTICE '👥 Role mapping: admin=admin, vet/assistant/receptionist=staff, client=client';
    RAISE NOTICE '🔗 Column mapping: patients.client_id (not owner_id)';
    RAISE NOTICE '🚀 System ready for client registration';
END $$;
