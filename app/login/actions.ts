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
        // Try the safe role detection function first
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: user.id });

        if (roleError) {
            console.error("Error fetching user role with safe function:", roleError.message);
            
            // Fallback: try direct profile access
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching profile directly:", profileError.message);
                    // Create profile if it doesn't exist
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
                    role = profile.role || 'client';
                }
            } catch (fallbackError) {
                console.error("Fallback profile access failed:", fallbackError);
                role = 'client'; // ultimate fallback
            }
        } else {
            role = roleResult || 'client';
        }

        // Determine destination based on role
        if (['admin', 'vet', 'assistant', 'receptionist'].includes(role)) {
            destination = "/dashboard";
        } else {
            destination = "/client";
        }

        console.log("Role detection result:", user.email, "->", role, "-> destination:", destination);

    } catch (error: any) {
        console.error("Role detection completely failed:", error.message);
        // Safe fallback - default to client
        role = 'client';
        destination = '/client';
        console.log("Using ultimate fallback role: client");
    }

    console.log("Redirecting to:", destination);
    revalidatePath("/", "layout");
    redirect(destination);
}
