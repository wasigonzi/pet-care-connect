-- Create Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    tax_id TEXT,
    website TEXT,
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policies (consistent with other modules for now)
CREATE POLICY "Staff can view suppliers" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert suppliers" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update suppliers" ON suppliers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can delete suppliers" ON suppliers FOR DELETE TO authenticated USING (true);

-- Add Audit Trigger (using existing function from audit_logs migration)
CREATE TRIGGER audit_suppliers_trigger
AFTER INSERT OR UPDATE OR DELETE ON suppliers
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
