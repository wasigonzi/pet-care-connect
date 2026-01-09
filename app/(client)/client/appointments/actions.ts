"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClientRecord } from "@/lib/auth-helpers";

export async function requestAppointment(formData: FormData) {
    const supabase = await createClient();
    const clientRecord = await getClientRecord();

    if (!clientRecord) {
        return { error: "No se encontró el registro del cliente" };
    }

    const patientId = formData.get("patientId") as string;
    const datetime = formData.get("datetime") as string;
    const reason = formData.get("reason") as string;
    const notes = formData.get("notes") as string;

    // Verify patient ownership
    const { data: patient } = await supabase
        .from("patients")
        .select("client_id")
        .eq("id", patientId)
        .single();

    if (!patient || patient.client_id !== clientRecord.id) {
        return { error: "No tienes permiso para crear citas para esta mascota" };
    }

    // Calculate end_time (1 hour after start_time by default)
    const startTime = new Date(datetime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const { data, error } = await supabase
        .from("appointments")
        .insert({
            client_id: clientRecord.id,
            patient_id: patientId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            appointment_type: reason || "Consulta General",
            reason: notes || null,
            status: "scheduled",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating appointment:", error);
        return { error: error.message };
    }

    revalidatePath("/client/appointments");
    redirect("/client/appointments");
}

export async function cancelAppointment(appointmentId: string) {
    const supabase = await createClient();
    const clientRecord = await getClientRecord();

    if (!clientRecord) {
        return { error: "No se encontró el registro del cliente" };
    }

    // Verify ownership and status
    const { data: appointment } = await supabase
        .from("appointments")
        .select("client_id, status")
        .eq("id", appointmentId)
        .single();

    if (!appointment || appointment.client_id !== clientRecord.id) {
        return { error: "No tienes permiso para cancelar esta cita" };
    }

    if (appointment.status === "completed") {
        return { error: "No puedes cancelar una cita completada" };
    }

    if (appointment.status === "cancelled") {
        return { error: "Esta cita ya está cancelada" };
    }

    const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

    if (error) {
        console.error("Error cancelling appointment:", error);
        return { error: error.message };
    }

    revalidatePath("/client/appointments");
    revalidatePath(`/client/appointments/${appointmentId}`);
    return { success: true };
}
