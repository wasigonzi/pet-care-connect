-- Create a function to cleanup duplicates and add constraint
DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Identify duplicates: groups of (page_id, key) having count > 1
    -- We want to keep the one with the latest updated_at
    FOR r IN 
        SELECT page_id, key
        FROM landing_sections
        GROUP BY page_id, key
        HAVING count(*) > 1
    LOOP
        -- Delete all but the newest one
        DELETE FROM landing_sections
        WHERE id IN (
            SELECT id
            FROM landing_sections
            WHERE page_id = r.page_id AND key = r.key
            ORDER BY updated_at DESC
            OFFSET 1
        );
    END LOOP;
END $$;

-- 2. Add Unique Constraint
ALTER TABLE landing_sections 
ADD CONSTRAINT landing_sections_page_key_unique UNIQUE (page_id, key);
