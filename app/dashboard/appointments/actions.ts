"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const appointmentSchema = z.object({
    client_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    start_time: z.string(), // ISO string
    end_time: z.string(),   // ISO string
    appointment_type: z.string().min(1),
    reason: z.string().optional(),
    notes: z.string().optional(),
});

export async function getAppointments(startDate: Date, endDate: Date) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("appointments")
        .select(`
      *,
      clients(first_name, last_name, phone),
      patients(name, species)
    `)
        .gte("start_time", startDate.toISOString())
        .lte("end_time", endDate.toISOString());

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createAppointmentAction(prevState: any, formData: FormData) {
    const rawData = {
        client_id: formData.get("client_id"),
        patient_id: formData.get("patient_id"),
        start_time: formData.get("start_time"),
        end_time: formData.get("end_time"),
        appointment_type: formData.get("appointment_type"),
        reason: formData.get("reason"),
        notes: formData.get("notes"),
    };

    const validated = appointmentSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();

    // Basic conflict detection
    const { data: conflicts } = await supabase
        .from("appointments")
        .select("id")
        .or(`and(start_time.lte.${validated.data.start_time},end_time.gt.${validated.data.start_time}),and(start_time.lt.${validated.data.end_time},end_time.gte.${validated.data.end_time})`)
        // @ts-ignore
        .in("status", ["scheduled", "confirmed"]);

    // @ts-ignore
    if (conflicts && conflicts.length > 0) {
        // In a real app we might allow overlapping but warn
        return { error: "Appointment conflict detected for this time slot." };
    }

    const { error } = await supabase.from("appointments").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/appointments");
    return { success: true };
}
