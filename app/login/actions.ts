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

    // TEMPORARY FIX: Skip profile check due to RLS infinite recursion
    // TODO: Fix RLS policies in Supabase dashboard
    console.log("Skipping profile check due to RLS issues, using email-based role detection");
    
    let role: string = "client"; // default
    let destination = "/client";

    // Use email-based role detection as temporary workaround
    if (user.email) {
        if (user.email.includes("admin@")) {
            role = "admin";
            destination = "/dashboard";
        } else if (user.email.includes("vet@")) {
            role = "vet";
            destination = "/dashboard";
        } else if (user.email.includes("assistant@")) {
            role = "assistant";
            destination = "/dashboard";
        } else if (user.email.includes("receptionist@")) {
            role = "receptionist";
            destination = "/dashboard";
        } else {
            role = "client";
            destination = "/client";
        }
    }

    console.log("Email-based role detection:", user.email, "->", role, "-> destination:", destination);

    console.log("Redirecting to:", destination);
    revalidatePath("/", "layout");
    redirect(destination);
}
