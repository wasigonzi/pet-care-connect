"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const templateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["email", "sms", "notification"]),
    subject_template: z.string().optional(),
    content_template: z.string().min(1, "Content is required"),
});

const logSchema = z.object({
    client_id: z.string().uuid(),
    type: z.enum(["email", "sms", "notification"]),
    subject: z.string().optional(),
    content: z.string().min(1, "Content is required"),
});

export async function getTemplates() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("communication_templates")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function getLogs() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("communication_logs")
        .select(`
      *,
      clients (first_name, last_name, email)
    `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createTemplateAction(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        type: formData.get("type"),
        subject_template: formData.get("subject_template"),
        content_template: formData.get("content_template"),
    };

    const validated = templateSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("communication_templates").insert(validated.data);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/communications");
    return { success: true };
}

export async function sendCommunicationAction(prevState: any, formData: FormData) {
    const rawData = {
        client_id: formData.get("client_id"),
        type: formData.get("type"),
        subject: formData.get("subject"),
        content: formData.get("content"),
    };

    const validated = logSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();

    // 1. Log the communication
    const { error } = await supabase.from("communication_logs").insert({
        ...validated.data,
        status: "sent", // Simulating instant send
        sent_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    // 2. In a real app, we would call an Email/SMS provider API here.

    revalidatePath("/dashboard/communications");
    return { success: true };
}
