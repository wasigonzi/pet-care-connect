"use client";

import { createInventoryItemAction } from "../actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    category: z.string().min(1, "La categoría es requerida"),
    sku: z.string().optional(),
    quantity: z.string().min(1, "La cantidad es requerida"),
    unit: z.string().min(1, "La unidad es requerida"),
    reorder_level: z.string().optional(),
    cost_price: z.string().optional(),
    selling_price: z.string().optional(),
    expiry_date: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof formSchema>;

export function InventoryForm() {
    const router = useRouter();
    const form = useForm<InventoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "Medication",
            unit: "pcs",
            quantity: "0",
        },
    });

    async function onSubmit(data: InventoryFormValues) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        const result = await createInventoryItemAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Error al agregar ítem");
        } else {
            toast.success("Ítem de inventario agregado exitosamente");
            router.push("/dashboard/inventory");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Ítem</FormLabel>
                                <FormControl>
                                    <Input placeholder="ej. Amoxicilina 500mg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Medication">Medicamento</SelectItem>
                                        <SelectItem value="Consumable">Consumible</SelectItem>
                                        <SelectItem value="Equipment">Equipo</SelectItem>
                                        <SelectItem value="Food">Alimento</SelectItem>
                                        <SelectItem value="Other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU / Código de Barras</FormLabel>
                                <FormControl>
                                    <Input placeholder="SKU-123456" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unidad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar unidad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pcs">Piezas</SelectItem>
                                        <SelectItem value="ml">Mililitros (ml)</SelectItem>
                                        <SelectItem value="mg">Miligramos (mg)</SelectItem>
                                        <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                                        <SelectItem value="box">Caja</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="cost_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio Costo</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" prefix="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="selling_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio Venta</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" prefix="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reorder_level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nivel de Reorden</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Caducidad (Opcional)</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit">Agregar Ítem</Button>
                </div>
            </form>
        </Form>
    );
}
