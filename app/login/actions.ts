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

    // PRODUCTION: Get user role from database using safe function
    let role: string = "client"; // default
    let destination = "/client";

    try {
        // Use the safe role detection function that doesn't cause recursion
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: user.id });

        if (roleError) {
            console.error("Error fetching user role:", roleError.message);
            // Fall back to creating a profile if none exists
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    role: 'client',
                    full_name: user.email?.split('@')[0] || 'User',
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (upsertError) {
                console.error("Error creating profile:", upsertError.message);
            }
            role = 'client'; // default fallback
        } else {
            role = roleResult || 'client';
        }

        // Determine destination based on role
        if (['admin', 'vet', 'assistant', 'receptionist'].includes(role)) {
            destination = "/dashboard";
        } else {
            destination = "/client";
        }

        console.log("Database role detection:", user.email, "->", role, "-> destination:", destination);

    } catch (error: any) {
        console.error("Role detection failed:", error.message);
        // Safe fallback - default to client
        role = 'client';
        destination = '/client';
        console.log("Using fallback role: client");
    }

    console.log("Redirecting to:", destination);
    revalidatePath("/", "layout");
    redirect(destination);
}
