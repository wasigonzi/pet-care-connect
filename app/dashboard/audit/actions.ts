"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAuditLogs() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("audit_logs")
        .select(`
      *,
      profiles (
        full_name,
        email,
        role
      )
    `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching audit logs:", error);
        throw new Error(error.message);
    }

    return data;
}
