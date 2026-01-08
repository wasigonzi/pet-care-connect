"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const itemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1),
    unit_price: z.coerce.number().min(0),
});

const estimateSchema = z.object({
    client_id: z.string().uuid(),
    valid_until: z.string().min(1, "Valid until date is required"),
    notes: z.string().optional(),
    items: z.array(itemSchema).min(1, "At least one item is required"),
});

export async function getEstimates() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("estimates")
        .select(`
            *,
            clients (
                first_name,
                last_name,
                email
            )
        `)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function createEstimateAction(formData: FormData) {
    const rawItems = formData.get("items");
    const items = rawItems ? JSON.parse(rawItems as string) : [];

    const rawData = {
        client_id: formData.get("client_id"),
        valid_until: formData.get("valid_until"),
        notes: formData.get("notes"),
        items,
    };

    const validated = estimateSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const { client_id, valid_until, notes, items: validItems } = validated.data;

    // Calculate total
    const total_amount = validItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    const supabase = await createClient();

    // Insert estimate
    const { data: estimate, error: estimateError } = await supabase
        .from("estimates")
        .insert({
            client_id,
            valid_until,
            notes,
            total_amount,
            status: 'draft'
        })
        .select()
        .single();

    if (estimateError) return { error: estimateError.message };

    // Insert items
    const { error: itemsError } = await supabase
        .from("estimate_items")
        .insert(
            validItems.map(item => ({
                estimate_id: estimate.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price
            }))
        );

    if (itemsError) return { error: itemsError.message };

    revalidatePath("/dashboard/estimates");
    redirect("/dashboard/estimates");
}

export async function convertEstimateToInvoice(estimateId: string) {
    const supabase = await createClient();

    // 1. Fetch Estimate and Items
    const { data: estimate, error: fetchError } = await supabase
        .from("estimates")
        .select(`
            *,
            estimate_items (*)
        `)
        .eq("id", estimateId)
        .single();

    if (fetchError || !estimate) {
        return { error: "Estimate not found" };
    }

    // 2. Create Invoice
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Default Net30

    const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
            client_id: estimate.client_id,
            status: 'draft',
            total_amount: estimate.total_amount,
            due_date: dueDate.toISOString(),
            notes: `Converted from Estimate #${estimate.id.slice(0, 8).toUpperCase()}. ${estimate.notes || ''}`
        })
        .select()
        .single();

    if (invoiceError) return { error: invoiceError.message };

    // 3. Create Invoice Items
    const invoiceItems = estimate.estimate_items.map((item: any) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        // Trigger auto-calculates total usually, but we check schema
    }));

    const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

    if (itemsError) return { error: itemsError.message };

    // 4. Update Estimate Status
    await supabase
        .from("estimates")
        .update({ status: 'converted' })
        .eq("id", estimateId);

    revalidatePath("/dashboard/estimates");
    revalidatePath("/dashboard/billing");
    return { success: true };
}
