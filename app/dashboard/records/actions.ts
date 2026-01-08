"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const recordSchema = z.object({
    patient_id: z.string().uuid(),
    date: z.string(),
    subjective: z.string().optional(),
    objective: z.string().optional(),
    assessment: z.string().optional(),
    plan: z.string().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    notes: z.string().optional(),
});

export async function getRecords() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("medical_records")
        .select(`
      *,
      patients(name, species, clients(first_name, last_name))
    `)
        .order("date", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createRecordAction(prevState: any, formData: FormData) {
    const rawData = {
        patient_id: formData.get("patient_id"),
        date: formData.get("date"),
        subjective: formData.get("subjective"),
        objective: formData.get("objective"),
        assessment: formData.get("assessment"),
        plan: formData.get("plan"),
        diagnosis: formData.get("diagnosis"),
        treatment: formData.get("treatment"),
        notes: formData.get("notes"),
    };

    const validated = recordSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("medical_records").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/records");
    return { success: true };
}
