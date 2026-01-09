-- Quick publish script for migrated content
-- Run this AFTER running the main migration

UPDATE landing_pages 
SET status = 'published' 
WHERE slug = 'home';

-- Verify
SELECT 
    slug, 
    status, 
    (SELECT COUNT(*) FROM landing_sections WHERE page_id = landing_pages.id) as section_count
FROM landing_pages 
WHERE slug = 'home';
