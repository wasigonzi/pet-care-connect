"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { createEstimateAction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { getClients } from "@/app/dashboard/clients/actions";
import { getInventory } from "@/app/dashboard/inventory/actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Package } from "lucide-react";

const formSchema = z.object({
    client_id: z.string().min(1, "El cliente es requerido"),
    valid_until: z.string().min(1, "La fecha es requerida"),
    notes: z.string().optional(),
    items: z.array(z.object({
        description: z.string().min(1, "Requerido"),
        quantity: z.coerce.number().min(1),
        unit_price: z.coerce.number().min(0),
    })).min(1, "Agregar al menos un ítem"),
});

export function EstimateForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [clients, setClients] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);

    useEffect(() => {
        getClients("").then(setClients);
        getInventory().then(setInventory);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            items: [{ description: "", quantity: 1, unit_price: 0 }],
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const total = form.watch("items").reduce((sum, item) => {
        return sum + (Number(item.quantity || 0) * Number(item.unit_price || 0));
    }, 0);

    const handleInventorySelect = (index: number, itemId: string) => {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            const currentQty = form.getValues(`items.${index}.quantity`) || 1;
            // We use standard React Hook Form setValue but since we are in FieldArray context, 
            // we should technically use 'update' or setValue at specific indices.
            form.setValue(`items.${index}.description`, item.name);
            form.setValue(`items.${index}.unit_price`, item.selling_price || 0);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append("client_id", values.client_id);
        formData.append("valid_until", values.valid_until);
        if (values.notes) formData.append("notes", values.notes);
        formData.append("items", JSON.stringify(values.items));

        startTransition(async () => {
            const result = await createEstimateAction(formData);
            if (result?.error) {
                toast.error("Error al crear presupuesto");
            } else {
                toast.success("Presupuesto creado exitosamente");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="client_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar cliente" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.first_name} {c.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="valid_until"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Válido Hasta</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Ítems</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar Ítem
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg bg-card/40">
                                <div className="flex-1 space-y-2">
                                    {/* Inventory Picker Helper */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <Select onValueChange={(val) => handleInventorySelect(index, val)}>
                                            <SelectTrigger className="h-8 text-xs w-[200px]">
                                                <SelectValue placeholder="Autocompletar de inventario..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {inventory.map(item => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name} (${item.selling_price})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Descripción (o seleccionar arriba)" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-24 pt-8">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="number" min="1" placeholder="Cant" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-32 pt-8">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unit_price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="number" min="0" step="0.01" placeholder="Precio" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="pt-8">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-right text-lg font-bold">
                        Total: ${total.toFixed(2)}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notas adicionales..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creando..." : "Crear Presupuesto"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
