"use client";

import { createVaccinationAction } from "../actions";
import { getClients } from "@/app/dashboard/clients/actions";
import { getPatientsByClientId } from "@/app/dashboard/patients/actions";
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

const formSchema = z.object({
    client_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    vaccine_name: z.string().min(1, "Vaccine name is required"),
    date_administered: z.string().min(1, "Date is required"),
    date_next_due: z.string().optional(),
});

type VaccinationFormValues = z.infer<typeof formSchema>;

export function VaccinationForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const form = useForm<VaccinationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_administered: new Date().toISOString().split("T")[0],
        },
    });

    const selectedClientId = form.watch("client_id");

    useEffect(() => {
        async function loadClients() {
            try {
                const data = await getClients("");
                setClients(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingClients(false);
            }
        }
        loadClients();
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
            toast.error(typeof result.error === 'string' ? result.error : "Failed to log vaccination");
        } else {
            toast.success("Vaccination logged successfully");
            router.push("/dashboard/vaccinations");
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
                                <FormLabel>Client</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select client" />
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
                                <FormLabel>Patient</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!selectedClientId || patients.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select patient" />
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

                <FormField
                    control={form.control}
                    name="vaccine_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vaccine Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Rabies, DHPP" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date_administered"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date Administered</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date_next_due"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Next Due Date</FormLabel>
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
                        Cancel
                    </Button>
                    <Button type="submit">Log Vaccination</Button>
                </div>
            </form>
        </Form>
    );
}
