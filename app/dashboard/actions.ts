"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Revenue (Sum of all paid invoices)
    // Note: JS .reduce might be slow for huge datasets, ideally use a Postgres function sum().
    // For now, we fetch minimal data for paid invoices.
    const { data: invoices } = await supabase
        .from("invoices")
        .select("total_amount")
        .eq("status", "paid");

    const totalRevenue = invoices?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

    // 2. Active Patients (Total count)
    const { count: activePatients } = await supabase
        .from("patients")
        .select("id", { count: "exact", head: true });

    // 3. Appointments Today
    const { count: appointmentsToday } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("start_time", today.toISOString())
        .lt("start_time", tomorrow.toISOString());

    // 4. Pending Tasks
    const { count: pendingTasks } = await supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

    return {
        revenue: totalRevenue,
        patients: activePatients || 0,
        appointments: appointmentsToday || 0,
        tasks: pendingTasks || 0
    };
}
