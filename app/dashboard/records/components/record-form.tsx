"use client";

import { createRecordAction } from "@/app/dashboard/records/actions";
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
import { Textarea } from "@/components/ui/textarea";
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
    client_id: z.string().uuid(), // Helper to filter patients
    patient_id: z.string().uuid(),
    date: z.string().min(1, "Date is required"),
    subjective: z.string().optional(),
    objective: z.string().optional(),
    assessment: z.string().optional(),
    plan: z.string().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
});

type RecordFormValues = z.infer<typeof formSchema>;

export function RecordForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const form = useForm<RecordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
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

    async function onSubmit(data: RecordFormValues) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        const result = await createRecordAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Failed to create record");
        } else {
            toast.success("Clinical record created successfully");
            router.push("/dashboard/records");
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

                <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                    <h3 className="font-semibold text-lg">SOAP Note</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="subjective"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subjective</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Owner reports..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="objective"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Objective</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Vitals, Exam findings..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assessment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assessment</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Analysis..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="plan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Treatment, Meds..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="diagnosis"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Diagnosis</FormLabel>
                                <FormControl>
                                    <Input placeholder="Primary Diagnosis" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="treatment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Treatment / Meds</FormLabel>
                                <FormControl>
                                    <Input placeholder="Prescription summary" {...field} />
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
                    <Button type="submit">Save Record</Button>
                </div>
            </form>
        </Form>
    );
}
