"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const clientSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
});

export async function getClients(query?: string) {
    const supabase = await createClient();

    let dbQuery = supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createClientAction(prevState: any, formData: FormData) {
    const rawData = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
    };

    const validated = clientSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("clients").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/clients");
    return { success: true };
}
