"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LandingSection = {
    id: string;
    key: string;
    content: any;
    order: number;
};

export async function getLandingPage(slug: string = 'home') {
    const supabase = await createClient();

    // Fetch page info
    const { data: page, error: pageError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (pageError && pageError.code !== 'PGRST116') {
        console.error("Error fetching landing page:", pageError);
        return null;
    }

    if (!page) {
        // Create if not exists (auto-init for 'home')
        const { data: newPage, error: createError } = await supabase
            .from('landing_pages')
            .insert({ slug, status: 'draft' })
            .select()
            .single();

        if (createError) {
            console.error("Error creating landing page:", createError);
            return null;
        }
        return { page: newPage, sections: [] };
    }

    // Fetch sections
    const { data: sections, error: sectionsError } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('order', { ascending: true });

    if (sectionsError) {
        console.error("Error fetching sections:", sectionsError);
    }

    return { page, sections: sections || [] };
}

export async function saveSection(pageId: string, key: string, content: any, order: number = 0) {
    const supabase = await createClient();

    // Check if section exists
    const { data: existing } = await supabase
        .from('landing_sections')
        .select('id')
        .eq('page_id', pageId)
        .eq('key', key)
        .single();

    if (existing) {
        const { error } = await supabase
            .from('landing_sections')
            .update({ content, "order": order, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await supabase
            .from('landing_sections')
            .insert({ page_id: pageId, key, content, "order": order });
        if (error) throw new Error(error.message);
    }

    revalidatePath('/dashboard/admin/landing');
}

export async function publishLanding(pageId: string) {
    const supabase = await createClient();

    // 1. Get current draft state
    const { data: sections } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('page_id', pageId);

    // 2. Create snapshot
    const snapshot = {
        published_at: new Date().toISOString(),
        sections: sections
    };

    // 3. Save version
    const { error: versionError } = await supabase
        .from('content_versions')
        .insert({
            page_id: pageId,
            version: Math.floor(Date.now() / 1000), // simplistic versioning
            status: 'published',
            snapshot: snapshot
        });

    if (versionError) throw new Error(versionError.message);

    // 4. Update page status
    const { error: pageError } = await supabase
        .from('landing_pages')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', pageId);

    if (pageError) throw new Error(pageError.message);

    revalidatePath('/'); // Revalidate public home
    revalidatePath('/dashboard/admin/landing');
    return { success: true };
}

// Public fetcher (cached)
export async function getPublishedContent(slug: string = 'home') {
    const supabase = await createClient();

    // 1. Check if page is published
    const { data: page } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (!page) return null;

    // 2. Get sections
    const { data: sections } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('order', { ascending: true });

    // Convert array to object map for easy consumption
    const contentMap: Record<string, any> = {};
    sections?.forEach(s => {
        contentMap[s.key] = s.content;
    });

    return contentMap;
}
