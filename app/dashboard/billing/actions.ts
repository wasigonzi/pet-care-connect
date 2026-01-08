"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for invoice items
const invoiceItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
});

const invoiceSchema = z.object({
    client_id: z.string().uuid(),
    status: z.enum(["draft", "issued", "paid", "void", "overdue"]),
    due_date: z.string().min(1),
    items: z.array(invoiceItemSchema).min(1),
    notes: z.string().optional(),
});

export async function getInvoices() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("invoices")
        .select(`
      *,
      clients (
        first_name,
        last_name,
        email
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createInvoiceAction(prevState: any, formData: FormData) {
    // Parsing complex form data (nested items) requires careful handling.
    // For simplicity in this demo, we'll assume the form sends a JSON string for items
    // or we handle a fixed number of items. Ideally, we use a more robust form handler.

    // Here we will rely on client-side to package items as JSON string "items"
    const rawItems = formData.get("items") as string;
    let items = [];
    try {
        items = JSON.parse(rawItems);
    } catch (e) {
        return { error: "Invalid items data" };
    }

    const rawData = {
        client_id: formData.get("client_id"),
        status: formData.get("status"),
        due_date: formData.get("due_date"),
        items: items,
        notes: formData.get("notes"),
    };

    const validated = invoiceSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();

    // 1. Create Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
            client_id: validated.data.client_id,
            status: validated.data.status,
            due_date: validated.data.due_date,
            total_amount: validated.data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
            notes: validated.data.notes
        })
        .select()
        .single();

    if (invoiceError) {
        return { error: invoiceError.message };
    }

    // 2. Create Invoice Items
    const invoiceItems = validated.data.items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

    if (itemsError) {
        // In a real app we might want to rollback the invoice creation here
        return { error: "Failed to save invoice items: " + itemsError.message };
    }

    revalidatePath("/dashboard/billing");
    return { success: true };
}
