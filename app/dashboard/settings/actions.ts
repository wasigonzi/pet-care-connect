"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    full_name: z.string().min(2),
});

export async function getMyProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return { ...data, email: user.email };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const rawData = {
        full_name: formData.get("full_name"),
    };

    const validated = profileSchema.safeParse(rawData);
    if (!validated.success) return { error: "Invalid data" };

    const { error } = await supabase
        .from("profiles")
        .update({ full_name: validated.data.full_name })
        .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/settings");
    return { success: true };
}
