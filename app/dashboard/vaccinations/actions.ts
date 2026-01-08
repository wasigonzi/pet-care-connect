"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vaccinationSchema = z.object({
    patient_id: z.string().uuid(),
    vaccine_name: z.string().min(1, "Vaccine name is required"),
    administered_at: z.string().min(1, "Date administered is required"),
    next_due_at: z.string().optional(),
});

export async function getVaccinations() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("vaccinations")
        .select(`
      *,
      patients (
        name,
        species,
        clients (
          first_name,
          last_name
        )
      )
    `)
        .order("administered_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createVaccinationAction(prevState: any, formData: FormData) {
    const rawData = {
        patient_id: formData.get("patient_id"),
        vaccine_name: formData.get("vaccine_name"),
        administered_at: formData.get("administered_at"),
        next_due_at: formData.get("next_due_at") || null,
    };

    const validated = vaccinationSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("vaccinations").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/vaccinations");
    return { success: true };
}
