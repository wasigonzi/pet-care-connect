"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCommunications() {
    const supabase = await createClient();
    const { data } = await supabase.from("communications").select(`
        *,
        clients (first_name, last_name, email),
        profiles (full_name)
    `).order("sent_at", { ascending: false });
    return data;
}
