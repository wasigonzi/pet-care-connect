"use client";

import { createAppointmentAction } from "@/app/dashboard/appointments/actions";
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
    date: z.string().min(1, "Date is required"),
    start_time: z.string().min(1, "Start time is required"),
    duration: z.string(), // "15", "30", "60"
    appointment_type: z.string().min(1),
    reason: z.string().optional(),
    notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof formSchema>;

export function NewAppointmentForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            duration: "30",
            appointment_type: "Consultation",
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
        async function loadPatients() {
            try {
                const data = await getPatientsByClientId(selectedClientId);
                setPatients(data || []);
            } catch (e) {
                console.error(e);
            }
        }
        loadPatients();
    }, [selectedClientId]);

    async function onSubmit(data: AppointmentFormValues) {
        // Construct full ISO timestamps
        const startDateTime = new Date(`${data.date}T${data.start_time}`);
        const endDateTime = new Date(startDateTime.getTime() + parseInt(data.duration) * 60000);

        const formData = new FormData();
        formData.append("client_id", data.client_id);
        formData.append("patient_id", data.patient_id);
        formData.append("start_time", startDateTime.toISOString());
        formData.append("end_time", endDateTime.toISOString());
        formData.append("appointment_type", data.appointment_type);
        formData.append("reason", data.reason || "");
        formData.append("notes", data.notes || "");

        const result = await createAppointmentAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Failed to book appointment");
        } else {
            toast.success("Appointment booked successfully");
            router.push("/dashboard/appointments");
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
                                            <SelectValue placeholder="Select a client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.first_name} {client.last_name}
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
                                            <SelectValue placeholder="Select a patient" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem key={patient.id} value={patient.id}>
                                                {patient.name}
                                            </SelectItem>
                                        ))}
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
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (min)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Duration" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="15">15 mins</SelectItem>
                                        <SelectItem value="30">30 mins</SelectItem>
                                        <SelectItem value="45">45 mins</SelectItem>
                                        <SelectItem value="60">1 Hour</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="appointment_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Consultation">Consultation</SelectItem>
                                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                                    <SelectItem value="Surgery">Surgery</SelectItem>
                                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                                    <SelectItem value="Grooming">Grooming</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reason / Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Reason for visit..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">Book Appointment</Button>
                </div>
            </form>
        </Form>
    );
}
