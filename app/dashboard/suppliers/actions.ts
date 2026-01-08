"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const supplierSchema = z.object({
    name: z.string().min(1, "Name is required"),
    contact_name: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    tax_id: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
});

export async function getSuppliers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function getSupplier(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function createSupplierAction(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        contact_name: formData.get("contact_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        tax_id: formData.get("tax_id"),
        website: formData.get("website"),
        notes: formData.get("notes"),
    };

    const validated = supplierSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("suppliers").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/suppliers");
    redirect("/dashboard/suppliers");
}

export async function deleteSupplierAction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("suppliers").delete().eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/suppliers");
    return { success: true };
}
