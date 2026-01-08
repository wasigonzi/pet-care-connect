"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPatient(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("patients")
        .select(`
            *,
            clients (
                id,
                first_name,
                last_name,
                email,
                phone,
                address
            ),
            medical_records (
                id,
                date,
                diagnosis,
                treatment,
                vet_id
            ),
            vaccinations (
                id,
                vaccine_name,
                administered_at,
                next_due_at
            ),
            appointments (
                id,
                start_time,
                status,
                appointment_type,
                reason
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getPatientVitals(id: string) {
    // In a real app, we might have a separate vitals table. 
    // For now, we'll just extract weight history from medical records if available
    // or just return the current stats.
    return [];
}
