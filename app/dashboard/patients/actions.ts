"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const patientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    species: z.string().min(1, "Species is required"),
    breed: z.string().optional(),
    gender: z.enum(["Male", "Female", "Unknown"]),
    date_of_birth: z.string().optional(),
    weight: z.string().optional(),
    client_id: z.string().uuid(),
});

export async function getPatientsByClientId(clientId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createPatientAction(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        species: formData.get("species"),
        breed: formData.get("breed"),
        gender: formData.get("gender"),
        date_of_birth: formData.get("date_of_birth") || null,
        weight: formData.get("weight") || null,
        client_id: formData.get("client_id"),
    };

    // weight conversion for schema (validation expects numbers but form gives strings)
    // For validation we check the basic structure
    const validated = patientSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("patients").insert({
        ...validated.data,
        weight: rawData.weight ? parseFloat(rawData.weight as string) : null,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/clients/${rawData.client_id}`);
    return { success: true };
}
