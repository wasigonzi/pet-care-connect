-- Landing Pages Table
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'draft', -- draft, published
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Sections Table
CREATE TABLE IF NOT EXISTS landing_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    key TEXT NOT NULL, -- hero, features, etc.
    content JSONB DEFAULT '{}'::jsonb,
    "order" INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Versions Table (Audit/History)
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    status TEXT NOT NULL,
    snapshot JSONB NOT NULL, -- Full page content snapshot
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Assets (Images/Media)
CREATE TABLE IF NOT EXISTS landing_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    alt TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_assets ENABLE ROW LEVEL SECURITY;

-- Policies for Landing Pages

-- Public: Readers can read PUBLISHED pages only (via specific function or carefully crafted policy)
-- Actually, for simplicity on public read, we often use a service_role fetch or a public policy
-- Let's allow public read-only access to 'published' pages
CREATE POLICY "Public read published pages" ON landing_pages 
FOR SELECT USING (status = 'published');

-- Admin: Full access
CREATE POLICY "Admins full access pages" ON landing_pages 
FOR ALL TO authenticated USING (true);


-- Policies for Landing Sections
CREATE POLICY "Public read sections of published pages" ON landing_sections 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM landing_pages 
        WHERE landing_pages.id = landing_sections.page_id 
        AND landing_pages.status = 'published'
    )
);

CREATE POLICY "Admins full access sections" ON landing_sections 
FOR ALL TO authenticated USING (true);


-- Policies for Versions (Admin only)
CREATE POLICY "Admins full access versions" ON content_versions 
FOR ALL TO authenticated USING (true);

-- Policies for Assets
-- Public read
CREATE POLICY "Public read assets" ON landing_assets 
FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins write assets" ON landing_assets 
FOR ALL TO authenticated USING (true);

-- Initial Data for Common Sections
-- We need to ensure the main page exists
INSERT INTO landing_pages (slug, status) 
VALUES ('home', 'draft') 
ON CONFLICT (slug) DO NOTHING;

-- Create storage bucket for landing-assets if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('landing-assets', 'landing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy
CREATE POLICY "Public Access Landing Assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'landing-assets' );

CREATE POLICY "Auth Upload Landing Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'landing-assets' );

CREATE POLICY "Auth Update Landing Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'landing-assets' );
