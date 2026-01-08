"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vaccinationSchema = z.object({
    patient_id: z.string().uuid(),
    vaccine_name: z.string().min(1, "Vaccine name is required"),
    date_administered: z.string().min(1, "Date administered is required"),
    date_next_due: z.string().optional(),
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
        .order("date_administered", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createVaccinationAction(prevState: any, formData: FormData) {
    const rawData = {
        patient_id: formData.get("patient_id"),
        vaccine_name: formData.get("vaccine_name"),
        date_administered: formData.get("date_administered"),
        date_next_due: formData.get("date_next_due") || null,
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
