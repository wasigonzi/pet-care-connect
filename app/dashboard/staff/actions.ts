"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStaff() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateStaffRole(userId: string, role: string) {
    const supabase = await createClient();

    // Check if user is admin - simplified as relying on RLS policies in real app
    // But for UI feedback:
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/staff");
    return { success: true };
}
