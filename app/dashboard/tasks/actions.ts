"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assigned_to: z.string().optional(),
    due_date: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
});

export async function getTasks() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select(`
      *,
      assigned:profiles!tasks_assigned_to_fkey(full_name)
    `)
        .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function createTaskAction(prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        assigned_to: formData.get("assigned_to") === "unassigned" ? null : formData.get("assigned_to"),
        due_date: formData.get("due_date") || null,
        priority: formData.get("priority"),
    };

    const validated = taskSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    // We need to get the current user ID for created_by
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("tasks").insert({
        ...validated.data,
        created_by: user?.id,
        status: 'pending'
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/tasks");
    return { success: true };
}

export async function updateTaskStatusAction(taskId: string, newStatus: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/tasks");
}
