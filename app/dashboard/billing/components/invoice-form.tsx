"use client";

import { createInvoiceAction } from "../actions";
import { getClients } from "@/app/dashboard/clients/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";

// Client-side schema including items
const invoiceItemSchema = z.object({
    description: z.string().min(1, "Descripción requerida"),
    quantity: z.coerce.number().min(1, "Mín 1"),
    unit_price: z.coerce.number().min(0, "Mín 0"),
});

const formSchema = z.object({
    client_id: z.string().uuid(),
    status: z.enum(["draft", "issued", "paid", "void", "overdue"]),
    due_date: z.string().min(1, "Fecha requerida"),
    items: z.array(invoiceItemSchema).min(1, "Al menos un ítem es requerido"),
    notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

export function InvoiceForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "draft",
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
            items: [{ description: "Consulta Veterinaria", quantity: 1, unit_price: 50 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchedItems = form.watch("items");

    useEffect(() => {
        const t = watchedItems.reduce((acc, item) => {
            const q = Number(item.quantity) || 0;
            const p = Number(item.unit_price) || 0;
            return acc + (q * p);
        }, 0);
        setTotal(t);
    }, [watchedItems]);

    useEffect(() => {
        async function loadClients() {
            try {
                const data = await getClients("");
                setClients(data || []);
            } catch (e) {
                console.error(e);
            }
        }
        loadClients();
    }, []);

    async function onSubmit(data: InvoiceFormValues) {
        const formData = new FormData();
        formData.append("client_id", data.client_id);
        formData.append("status", data.status);
        formData.append("due_date", data.due_date);
        formData.append("notes", data.notes || "");
        formData.append("items", JSON.stringify(data.items));

        const result = await createInvoiceAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Error al crear factura");
        } else {
            toast.success("Factura creada exitosamente");
            router.push("/dashboard/billing");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="issued">Emitida</SelectItem>
                                            <SelectItem value="paid">Pagada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="due_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Vencimiento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Ítems</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar Ítem
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                            <div className="col-span-6">Descripción</div>
                            <div className="col-span-2">Cant</div>
                            <div className="col-span-2">Precio</div>
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1"></div>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => <Input {...field} placeholder="Descripción del ítem" />}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => <Input type="number" {...field} />}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unit_price`}
                                        render={({ field }) => <Input type="number" step="0.01" {...field} />}
                                    />
                                </div>
                                <div className="col-span-1 font-medium text-right">
                                    ${((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unit_price || 0)).toFixed(2)}
                                </div>
                                <div className="col-span-1 text-right">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <div className="text-xl font-bold">
                            Total: ${total.toFixed(2)}
                        </div>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Instrucciones de pago..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit">Crear Factura</Button>
                </div>
            </form>
        </Form>
    );
}
