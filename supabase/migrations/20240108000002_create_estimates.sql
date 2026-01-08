-- Create Estimates Table
CREATE TYPE estimate_status AS ENUM ('draft', 'sent', 'accepted', 'declined', 'converted');

CREATE TABLE IF NOT EXISTS estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0,
    valid_until DATE,
    status estimate_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Estimate Items Table
CREATE TABLE IF NOT EXISTS estimate_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Staff can view estimates" ON estimates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert estimates" ON estimates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update estimates" ON estimates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can delete estimates" ON estimates FOR DELETE TO authenticated USING (true);

CREATE POLICY "Staff can view estimate items" ON estimate_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert estimate items" ON estimate_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update estimate items" ON estimate_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can delete estimate items" ON estimate_items FOR DELETE TO authenticated USING (true);

-- Trigger for Audit
CREATE TRIGGER audit_estimates_trigger
AFTER INSERT OR UPDATE OR DELETE ON estimates
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
