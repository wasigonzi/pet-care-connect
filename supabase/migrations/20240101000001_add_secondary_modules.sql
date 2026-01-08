-- 1. COMMUNICATIONS
CREATE TYPE communication_type AS ENUM ('email', 'sms', 'notification');
CREATE TYPE communication_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE communication_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type communication_type NOT NULL,
  subject_template TEXT,
  content_template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE communication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type communication_type NOT NULL,
  direction TEXT DEFAULT 'outbound', -- inbound/outbound
  subject TEXT,
  content TEXT,
  status communication_status DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BOARDING
CREATE TYPE boarding_unit_type AS ENUM ('cage', 'suite', 'run', 'condo');
CREATE TYPE boarding_unit_status AS ENUM ('available', 'occupied', 'cleaning', 'maintenance');

CREATE TABLE boarding_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type boarding_unit_type NOT NULL,
  size TEXT, -- Small, Medium, Large
  status boarding_unit_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE boarding_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES boarding_units(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'confirmed', -- confirmed, checked_in, checked_out, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Staff Access Policies (Simplified for all authenticated staff)
CREATE POLICY "Staff all access templates" ON communication_templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access logs" ON communication_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access boarding units" ON boarding_units FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access boarding reservations" ON boarding_reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access tasks" ON tasks FOR ALL TO authenticated USING (true);

-- Seed some initial data
INSERT INTO boarding_units (name, type, size) VALUES
('Cage 1', 'cage', 'Small'),
('Cage 2', 'cage', 'Small'),
('Run 1', 'run', 'Large'),
('Suite A', 'suite', 'Large');

INSERT INTO communication_templates (name, type, subject_template, content_template) VALUES
('Appointment Reminder', 'email', 'Reminder: Appointment for {{pet_name}}', 'Dear {{owner_name}}, this is a reminder for your appointment on {{date}}.'),
('Vaccination Due', 'sms', NULL, 'Hi {{owner_name}}, {{pet_name}} is due for vaccinations.');
