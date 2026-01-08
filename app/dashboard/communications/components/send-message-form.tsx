"use client";

import { sendCommunicationAction } from "../actions";
import { getTemplates } from "@/app/dashboard/templates/actions";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    client_id: z.string().uuid(),
    type: z.enum(["email", "sms", "notification"]),
    subject: z.string().optional(),
    content: z.string().min(1, "Content is required"),
});

type CommunicationFormValues = z.infer<typeof formSchema>;

export function SendMessageForm() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);

    const form = useForm<CommunicationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "email",
        },
    });

    const watchType = form.watch("type");

    useEffect(() => {
        async function loadData() {
            const [clientsData, templatesData] = await Promise.all([
                getClients(""),
                getTemplates()
            ]);
            setClients(clientsData || []);
            setTemplates(templatesData || []);
        }
        loadData();
    }, []);

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            form.setValue("type", template.type);
            if (template.subject_template) form.setValue("subject", template.subject_template);
            form.setValue("content", template.content_template);
        }
    };

    async function onSubmit(data: CommunicationFormValues) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value || "");
        });

        const result = await sendCommunicationAction(null, formData);

        if (result?.error) {
            toast.error(typeof result.error === 'string' ? result.error : "Error al enviar mensaje");
        } else {
            toast.success("Mensaje enviado exitosamente");
            router.push("/dashboard/communications");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Cargar Plantilla (Opcional)</FormLabel>
                        <Select onValueChange={handleTemplateSelect}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar una plantilla" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {templates.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name} ({t.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                </div>

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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="email">Correo</SelectItem>
                                        <SelectItem value="sms">SMS</SelectItem>
                                        <SelectItem value="notification">Notificación</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {watchType === 'email' && (
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asunto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Línea de asunto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contenido del Mensaje</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Escribe tu mensaje aquí..." className="min-h-[150px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit">Enviar Mensaje</Button>
                </div>
            </form>
        </Form>
    );
}
