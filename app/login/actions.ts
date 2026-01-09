"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validated = loginSchema.safeParse({ email, password });

    if (!validated.success) {
        return { error: "Invalid email or password format." };
    }

    const supabase = await createClient();

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    if (!data.user) {
        return { error: "Authentication failed" };
    }

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profile) {
        // If no profile exists, create one with default client role
        await supabase.from('profiles').insert({
            id: data.user.id,
            role: 'client',
            full_name: data.user.email?.split('@')[0] || 'User',
        });
        redirect("/client");
    }

    // Redirect based on role
    if (profile.role === 'client') {
        redirect("/client");
    } else {
        // staff or admin
        redirect("/dashboard");
    }
}
