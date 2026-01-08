"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
    const supabase = await createClient();

    // Parallel queries
    const [
        { count: clientCount },
        { count: patientCount },
        { count: appointmentCount },
        { data: invoices },
        { data: lowStock }
    ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("patients").select("*", { count: "exact", head: true }),
        supabase.from("appointments").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("total_amount, status, created_at").eq('status', 'paid'),
        supabase.from("inventory_items").select("id").lt("quantity", 10), // simplified low stock check
    ]);

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0) || 0;

    // Revenue by month (simple last 12 months aggregation)
    const revenueByMonth: Record<string, number> = {};
    invoices?.forEach(inv => {
        const month = new Date(inv.created_at).toLocaleString('default', { month: 'short' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(inv.total_amount);
    });

    const chartData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }));

    return {
        clientCount: clientCount || 0,
        patientCount: patientCount || 0,
        appointmentCount: appointmentCount || 0,
        totalRevenue,
        lowStockCount: lowStock?.length || 0,
        chartData
    };
}
