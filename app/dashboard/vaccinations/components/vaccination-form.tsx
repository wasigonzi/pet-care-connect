"use client";

import { createVaccinationAction } from "../actions";
import { getClients } from "@/app/dashboard/clients/actions";
import { getPatientsByClientId } from "@/app/dashboard/patients/actions";
import { getInventory } from "@/app/dashboard/inventory/actions";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Syringe } from "lucide-react";

const formSchema = z.object({
    client_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    vaccine_name: z.string().min(1, "Vaccine name is required"),
    administered_at: z.string().min(1, "Date is required"),
    next_due_at: z.string().optional(),
});

type VaccinationFormValues = z.infer<typeof formSchema>;

export function VaccinationForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);

    const form = useForm<VaccinationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            administered_at: new Date().toISOString().split("T")[0],
        },
    });

    const selectedClientId = form.watch("client_id");

    useEffect(() => {
        getClients("").then(setClients);
        getInventory().then(setInventory);
    }, []);

    useEffect(() => {
        if (!selectedClientId) {
            setPatients([]);
            return;
        }
        const loadPatients = async () => {
            const data = await getPatientsByClientId(selectedClientId);
            setPatients(data || []);
        };
        loadPatients();
    }, [selectedClientId]);

    async function onSubmit(data: VaccinationFormValues) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        const result = await createVaccinationAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Error al registrar vacunación");
        } else {
            toast.success("Vacunación registrada exitosamente");
            router.push("/dashboard/vaccinations");
        }
    }

    const handleInventorySelect = (itemId: string) => {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            form.setValue("vaccine_name", item.name);
        }
    };

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
                    <FormField
                        control={form.control}
                        name="patient_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paciente</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!selectedClientId || patients.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar paciente" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {patients.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormLabel>Detalles de Vacuna</FormLabel>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="vaccine_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Nombre de Vacuna (ej. Rabia)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-[200px]">
                            <Select onValueChange={handleInventorySelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Stock..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventory.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground">
                        Seleccionar del stock asegura que el inventario se deduzca correctamente.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="administered_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Administración</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="next_due_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Próxima Dosis</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit">Registrar Vacuna</Button>
                </div>
            </form>
        </Form>
    );
}
