-- 1. TIME TRACKING
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  clock_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clock_out TIMESTAMP WITH TIME ZONE,
  break_duration INTEGER DEFAULT 0, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLATFORM SETTINGS (Admin)
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Time tracking policies
CREATE POLICY "Staff can view own time entries" ON time_entries FOR SELECT TO authenticated USING (auth.uid() = staff_id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'vet'));
CREATE POLICY "Staff can insert own time entry" ON time_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = staff_id);
CREATE POLICY "Staff can update own time entry" ON time_entries FOR UPDATE TO authenticated USING (auth.uid() = staff_id);

-- Settings policies
CREATE POLICY "Admins can manage settings" ON platform_settings FOR ALL TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Everyone can read public settings" ON platform_settings FOR SELECT TO authenticated USING (true); -- Simplified

-- Seed Settings
INSERT INTO platform_settings (key, value, description) VALUES
('clinic_info', '{"name": "Pet Care Connect", "phone": "555-0123", "address": "123 Vet Lane"}'::jsonb, 'General clinic information'),
('business_hours', '{"monday": "09:00-17:00", "tuesday": "09:00-17:00"}'::jsonb, 'Operating hours');
