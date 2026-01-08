-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Staff/Users)
CREATE TYPE user_role AS ENUM ('admin', 'vet', 'assistant', 'receptionist');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'assistant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CLIENTS
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PATIENTS
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL, -- Dog, Cat, etc.
  breed TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Unknown')),
  weight NUMERIC(5, 2), -- kg
  microchip_number TEXT,
  is_deceased BOOLEAN DEFAULT FALSE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. APPOINTMENTS
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES profiles(id), -- Assigned vet
  appointment_type TEXT NOT NULL, -- Consultation, Surgery, Vaccination, etc.
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MEDICAL RECORDS (Clinical)
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES profiles(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subjective TEXT, -- S
  objective TEXT,  -- O
  assessment TEXT, -- A
  plan TEXT,       -- P
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  attachments JSONB DEFAULT '[]', -- Array of URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. VACCINATIONS
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  batch_number TEXT,
  administered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_due_at TIMESTAMP WITH TIME ZONE,
  vet_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INVENTORY
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT, -- bottle, pill, pack
  reorder_level INTEGER DEFAULT 5,
  cost_price NUMERIC(10, 2),
  selling_price NUMERIC(10, 2),
  supplier TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. INVOICES & PAYMENTS
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'void', 'overdue');

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  status invoice_status DEFAULT 'draft',
  total_amount NUMERIC(10, 2) DEFAULT 0,
  tax_amount NUMERIC(10, 2) DEFAULT 0,
  details JSONB, -- Extra details
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read everything (simplified for now, strictly inner-system)
CREATE POLICY "Authenticated users can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- For other tables, allow full access to authenticated staff (simplified). 
-- In production, you'd check profile.role.
CREATE POLICY "Staff can view clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can delete clients" ON clients FOR DELETE TO authenticated USING (true);

-- Repeat for others (Helper function or macro isn't available in standard SQL here easily, explicit is better)
CREATE POLICY "Staff all access patients" ON patients FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access appointments" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access records" ON medical_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access vaccinations" ON vaccinations FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access inventory" ON inventory_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access invoices" ON invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff all access invoice items" ON invoice_items FOR ALL TO authenticated USING (true);

-- Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'assistant');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
