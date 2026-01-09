"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReminders(page = 0, pageSize = 50, statusFilter?: string) {
    const supabase = await createClient();
    
    try {
        // Use the optimized pagination function for better performance
        const { data, error } = await supabase
            .rpc('get_reminders_paginated', {
                page_size: pageSize,
                page_offset: page * pageSize,
                status_filter: statusFilter || null
            });

        if (error) {
            console.error('Error fetching reminders:', error);
            // Fallback to simple query if function doesn't exist yet
            const { data: fallbackData, error: fallbackError } = await supabase
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
                .order("due_date", { ascending: true })
                .limit(pageSize)
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (fallbackError) throw new Error(fallbackError.message);
            return fallbackData;
        }

        return data;
    } catch (error: any) {
        console.error('Reminders query failed:', error);
        throw new Error(error.message);
    }
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
