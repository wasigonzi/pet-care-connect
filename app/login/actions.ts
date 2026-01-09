"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Starting login for:", email);

    // Validate input
    const validated = loginSchema.safeParse({ email, password });

    if (!validated.success) {
        return { error: "Formato de email o contraseña inválido." };
    }

    const supabase = await createClient();

    // Attempt sign in
    const {
        error: signInError,
        data: { user, session },
    } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.error("Sign in error:", signInError.message);
        return { error: "Credenciales inválidas o error de autenticación." };
    }

    if (!user) {
        return { error: "Autenticación fallida: No user data" };
    }

    console.log("Authenticated successfully:", user.id);

    // Get user profile - Use the authenticated supabase client
    // Note: we don't strictly need to recreate the client, the same instance should have the session.
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        // If it's a permission error, we might have an RLS issue
    }

    // Determine role and destination
    let role = profile?.role;
    let destination = "/client";

    if (!role) {
        console.log("No profile found or accessible, ensuring profile exists for:", user.id);

        // Attempt to upsert the profile to avoid "duplicate key" issues if it exists but wasn't visible
        const { data: newProfile, error: upsertError } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                role: "client",
                full_name: user.email?.split("@")[0] || "User",
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select("role")
            .maybeSingle();

        if (upsertError) {
            console.error("Error upserting profile:", upsertError.message);
            // Even if upsert fails, we try to proceed to a default destination
            // instead of blocking the user completely if they are already authenticated.
            console.warn("Proceeding with default client destination despite profile error.");
        } else if (newProfile) {
            role = newProfile.role;
            console.log("Profile ensured successfully, role:", role);
        }
    }

    // Set destination based on verified or default role
    if (role && ["admin", "vet", "assistant", "receptionist"].includes(role)) {
        destination = "/dashboard";
    } else {
        destination = "/client";
    }

    console.log("Redirecting to:", destination);
    revalidatePath("/", "layout");
    redirect(destination);
}
