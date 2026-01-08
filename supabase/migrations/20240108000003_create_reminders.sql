-- Create Reminders Table
CREATE TYPE reminder_type AS ENUM ('vaccination', 'appointment', 'wellness', 'follow_up', 'general');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'completed', 'dismissed');

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    type reminder_type DEFAULT 'general',
    status reminder_status DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Staff can view reminders" ON reminders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert reminders" ON reminders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can update reminders" ON reminders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can delete reminders" ON reminders FOR DELETE TO authenticated USING (true);

-- Logic to auto-generate reminders from Vaccinations (Example trigger)
CREATE OR REPLACE FUNCTION generate_vaccine_reminder() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.next_due_at IS NOT NULL THEN
     INSERT INTO reminders (patient_id, client_id, title, due_date, type, status)
     SELECT 
        NEW.patient_id,
        p.client_id,
        'Vaccination Due: ' || NEW.vaccine_name,
        NEW.next_due_at::DATE,
        'vaccination',
        'pending'
     FROM patients p
     WHERE p.id = NEW.patient_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vaccination_created
  AFTER INSERT ON vaccinations
  FOR EACH ROW EXECUTE PROCEDURE generate_vaccine_reminder();
