import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST() {
    const supabase = await createClient();
    
    // Sign out the user
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error signing out:', error);
        // Even if there's an error, redirect to login
    }
    
    // Redirect to login page
    redirect('/login');
}