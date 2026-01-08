"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reservationSchema = z.object({
    patient_id: z.string().uuid(),
    unit_id: z.string().uuid(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    notes: z.string().optional(),
});

export async function getUnits() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("boarding_units")
        .select("*")
        .order("name");

    if (error) throw new Error(error.message);
    return data;
}

export async function getReservations() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("boarding_reservations")
        .select(`
      *,
      boarding_units (name, type),
      patients (name, species, clients(first_name, last_name))
    `)
        .order("start_date", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createReservationAction(prevState: any, formData: FormData) {
    const rawData = {
        patient_id: formData.get("patient_id"),
        unit_id: formData.get("unit_id"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        notes: formData.get("notes"),
    };

    const validated = reservationSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();

    // Basic overlap check
    const { data: conflicts } = await supabase
        .from("boarding_reservations")
        .select("id")
        .eq("unit_id", validated.data.unit_id)
        .or(`and(start_date.lte.${validated.data.start_date},end_date.gt.${validated.data.start_date}),and(start_date.lt.${validated.data.end_date},end_date.gte.${validated.data.end_date})`)
        .neq("status", "cancelled");

    // @ts-ignore
    if (conflicts && conflicts.length > 0) {
        return { error: "This unit is already booked for the selected dates." };
    }

    const { error } = await supabase.from("boarding_reservations").insert(validated.data);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/boarding");
    return { success: true };
}
