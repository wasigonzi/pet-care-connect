"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inventorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    sku: z.string().optional(),
    quantity: z.string().transform((val) => parseInt(val, 10)),
    unit: z.string().min(1, "Unit is required"),
    reorder_level: z.string().transform((val) => parseInt(val, 10)).optional(),
    cost_price: z.string().transform((val) => parseFloat(val)).optional(),
    selling_price: z.string().transform((val) => parseFloat(val)).optional(),
    expiry_date: z.string().optional(),
});

export async function getInventory() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createInventoryItemAction(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        category: formData.get("category"),
        sku: formData.get("sku"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        reorder_level: formData.get("reorder_level"),
        cost_price: formData.get("cost_price"),
        selling_price: formData.get("selling_price"),
        expiry_date: formData.get("expiry_date") || null,
    };

    const validated = inventorySchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("inventory_items").insert(validated.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/inventory");
    return { success: true };
}
