"use client";

import { createReservationAction, getUnits } from "../actions";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    client_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    unit_id: z.string().uuid(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    notes: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof formSchema>;

export function ReservationForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    const form = useForm<ReservationFormValues>({
        resolver: zodResolver(formSchema),
    });

    const selectedClientId = form.watch("client_id");

    useEffect(() => {
        async function loadData() {
            const [clientsData, unitsData] = await Promise.all([
                getClients(""),
                getUnits()
            ]);
            setClients(clientsData || []);
            setUnits(unitsData || []);
        }
        loadData();
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

    async function onSubmit(data: ReservationFormValues) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        const result = await createReservationAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Failed to create reservation");
        } else {
            toast.success("Reservation created successfully");
            router.push("/dashboard/boarding");
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
                    name="unit_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a unit/room" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {units.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name} ({u.type} - {u.size})
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
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Check-in Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Check-out Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Feeding, Meds, etc..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">Book Reservation</Button>
                </div>
            </form>
        </Form>
    );
}
