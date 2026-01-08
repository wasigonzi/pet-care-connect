"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const communicationSchema = z.object({
    client_id: z.string().uuid(),
    type: z.enum(["email", "sms", "notification"]),
    subject: z.string().optional(),
    content: z.string().min(1),
});

export async function getCommunications() {
    const supabase = await createClient();
    const { data } = await supabase.from("communications").select(`
        *,
        clients (first_name, last_name, email),
        profiles (full_name)
    `).order("sent_at", { ascending: false });
    return data;
}

export async function sendCommunicationAction(prevState: any, formData: FormData) {
    const rawData = {
        client_id: formData.get("client_id"),
        type: formData.get("type"),
        subject: formData.get("subject"),
        content: formData.get("content"),
    };

    const validated = communicationSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos inválidos" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("communications").insert({
        ...validated.data,
        sent_at: new Date().toISOString(),
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/communications");
    return { success: true };
}
