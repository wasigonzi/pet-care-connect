-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id), -- Who performed the action
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB, -- Stores old/new values
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- AUDIT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
  changes JSONB;
BEGIN
  user_id := auth.uid();
  
  IF (TG_OP = 'INSERT') THEN
    changes := to_jsonb(NEW);
    INSERT INTO audit_logs (user_id, action, table_name, record_id, changes)
    VALUES (user_id, TG_OP, TG_TABLE_NAME, NEW.id, changes);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    changes := jsonb_build_object('old', OLD, 'new', NEW);
    INSERT INTO audit_logs (user_id, action, table_name, record_id, changes)
    VALUES (user_id, TG_OP, TG_TABLE_NAME, NEW.id, changes);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    changes := to_jsonb(OLD);
    INSERT INTO audit_logs (user_id, action, table_name, record_id, changes)
    VALUES (user_id, TG_OP, TG_TABLE_NAME, OLD.id, changes);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- APPLY TRIGGERS TO CORE TABLES
CREATE TRIGGER audit_clients_trigger
AFTER INSERT OR UPDATE OR DELETE ON clients
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_patients_trigger
AFTER INSERT OR UPDATE OR DELETE ON patients
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_appointments_trigger
AFTER INSERT OR UPDATE OR DELETE ON appointments
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_invoices_trigger
AFTER INSERT OR UPDATE OR DELETE ON invoices
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_inventory_trigger
AFTER INSERT OR UPDATE OR DELETE ON inventory_items
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
