"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTemplates() {
    const supabase = await createClient();
    const { data } = await supabase.from("templates").select("*").order("name");
    return data;
}

export async function getTemplate(id: string) {
    const supabase = await createClient();
    const { data } = await supabase.from("templates").select("*").eq("id", id).single();
    return data;
}
