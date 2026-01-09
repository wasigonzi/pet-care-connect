-- Add created_at column to landing_sections if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'landing_sections' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE landing_sections 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        -- Backfill existing rows
        UPDATE landing_sections 
        SET created_at = updated_at 
        WHERE created_at IS NULL;
    END IF;
END $$;
