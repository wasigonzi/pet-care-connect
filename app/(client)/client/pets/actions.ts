"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClientRecord } from "@/lib/auth-helpers";

export async function createPet(formData: FormData) {
    const supabase = await createClient();
    const clientRecord = await getClientRecord();

    if (!clientRecord) {
        return { error: "No se encontró el registro del cliente" };
    }

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const breed = formData.get("breed") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const color = formData.get("color") as string;
    const microchipNumber = formData.get("microchipNumber") as string;
    const notes = formData.get("notes") as string;

    const { data, error } = await supabase
        .from("patients")
        .insert({
            client_id: clientRecord.id,
            name,
            species,
            breed,
            gender,
            date_of_birth: dateOfBirth || null,
            color: color || null,
            microchip_number: microchipNumber || null,
            notes: notes || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating pet:", error);
        return { error: error.message };
    }

    revalidatePath("/client/pets");
    redirect("/client/pets");
}

export async function updatePet(petId: string, formData: FormData) {
    const supabase = await createClient();
    const clientRecord = await getClientRecord();

    if (!clientRecord) {
        return { error: "No se encontró el registro del cliente" };
    }

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const breed = formData.get("breed") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const color = formData.get("color") as string;
    const microchipNumber = formData.get("microchipNumber") as string;
    const notes = formData.get("notes") as string;

    // Verify ownership
    const { data: pet } = await supabase
        .from("patients")
        .select("client_id")
        .eq("id", petId)
        .single();

    if (!pet || pet.client_id !== clientRecord.id) {
        return { error: "No tienes permiso para editar esta mascota" };
    }

    const { error } = await supabase
        .from("patients")
        .update({
            name,
            species,
            breed,
            gender,
            date_of_birth: dateOfBirth || null,
            color: color || null,
            microchip_number: microchipNumber || null,
            notes: notes || null,
        })
        .eq("id", petId);

    if (error) {
        console.error("Error updating pet:", error);
        return { error: error.message };
    }

    revalidatePath("/client/pets");
    revalidatePath(`/client/pets/${petId}`);
    redirect(`/client/pets/${petId}`);
}

export async function deletePet(petId: string) {
    const supabase = await createClient();
    const clientRecord = await getClientRecord();

    if (!clientRecord) {
        return { error: "No se encontró el registro del cliente" };
    }

    // Verify ownership
    const { data: pet } = await supabase
        .from("patients")
        .select("client_id")
        .eq("id", petId)
        .single();

    if (!pet || pet.client_id !== clientRecord.id) {
        return { error: "No tienes permiso para eliminar esta mascota" };
    }

    const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", petId);

    if (error) {
        console.error("Error deleting pet:", error);
        return { error: error.message };
    }

    revalidatePath("/client/pets");
    redirect("/client/pets");
}
