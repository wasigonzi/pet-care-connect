"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReminders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("reminders")
        .select(`
            *,
            patients (
                name,
                species
            ),
            clients (
                first_name,
                last_name,
                email
            )
        `)
        .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function updateReminderStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("reminders")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/reminders");
    return { success: true };
}

export async function deleteReminder(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/reminders");
    return { success: true };
}
