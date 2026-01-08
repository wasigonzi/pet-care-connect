"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWellnessPlans() {
    const supabase = await createClient();
    const { data } = await supabase.from("wellness_plans").select("*").order("name");
    return data;
}
