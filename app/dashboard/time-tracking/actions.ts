"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTimeEntries() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("staff_id", user.id)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getLastEntry() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("staff_id", user.id)
        .is("clock_out", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    // PGRST116 means no rows returned, which is fine (not clocked in)
    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching last entry:", error);
    }

    return data;
}

export async function clockInAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("time_entries").insert({
        staff_id: user.id
    });

    if (error) return { error: error.message };
    revalidatePath("/dashboard/time-tracking");
    return { success: true };
}

export async function clockOutAction(entryId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("time_entries")
        .update({ clock_out: new Date().toISOString() })
        .eq("id", entryId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/time-tracking");
    return { success: true };
}
