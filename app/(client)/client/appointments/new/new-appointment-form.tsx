"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { requestAppointment } from "../actions";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

const appointmentSchema = z.object({
    patientId: z.string().min(1, "Selecciona una mascota"),
    datetime: z.string().min(1, "Selecciona fecha y hora"),
    reason: z.string().min(3, "Describe el motivo de la consulta"),
    notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface NewAppointmentPageProps {
    pets: Array<{
        id: string;
        name: string;
        species: string;
        breed: string;
    }>;
}

export default function NewAppointmentForm({ pets }: NewAppointmentPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
    });

    const onSubmit = async (data: AppointmentFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const result = await requestAppointment(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("¡Solicitud de cita enviada! La clínica te confirmará pronto.");
                // Redirect is handled by the server action
            }
        } catch (error: any) {
            console.error("Error requesting appointment:", error);
            toast.error("Error al solicitar la cita");
        } finally {
            setLoading(false);
        }
    };

    // Get minimum datetime (now + 1 hour)
    const getMinDatetime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/client/appointments">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Solicitar Cita</h1>
                    <p className="text-muted-foreground">
                        Programa una consulta veterinaria para tu mascota
                    </p>
                </div>
            </div>

            {pets.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Primero agrega una mascota</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Necesitas tener al menos una mascota registrada para solicitar una cita
                        </p>
                        <Link href="/client/pets/new">
                            <Button size="lg">
                                Agregar Mascota
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Cita</CardTitle>
                        <CardDescription>
                            Completa los detalles para solicitar tu cita. La clínica confirmará la disponibilidad.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Pet Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="patientId">Mascota *</Label>
                                <Select
                                    onValueChange={(value) => setValue("patientId", value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una mascota..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pets.map((pet) => (
                                            <SelectItem key={pet.id} value={pet.id}>
                                                {pet.name} ({pet.species} - {pet.breed})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patientId && (
                                    <p className="text-sm text-red-500">{errors.patientId.message}</p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="space-y-2">
                                <Label htmlFor="datetime">Fecha y Hora Preferida *</Label>
                                <Input
                                    id="datetime"
                                    type="datetime-local"
                                    min={getMinDatetime()}
                                    {...register("datetime")}
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Esta es tu preferencia. La clínica confirmará la disponibilidad.
                                </p>
                                {errors.datetime && (
                                    <p className="text-sm text-red-500">{errors.datetime.message}</p>
                                )}
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <Label htmlFor="reason">Motivo de la Consulta *</Label>
                                <Select
                                    onValueChange={(value) => setValue("reason", value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el motivo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Consulta General">Consulta General</SelectItem>
                                        <SelectItem value="Vacunación">Vacunación</SelectItem>
                                        <SelectItem value="Control">Control / Chequeo</SelectItem>
                                        <SelectItem value="Emergencia">Emergencia</SelectItem>
                                        <SelectItem value="Cirugía">Cirugía</SelectItem>
                                        <SelectItem value="Dental">Limpieza Dental</SelectItem>
                                        <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.reason && (
                                    <p className="text-sm text-red-500">{errors.reason.message}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas Adicionales</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Describe síntomas, comportamiento o cualquier información relevante..."
                                    rows={4}
                                    {...register("notes")}
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ayuda al veterinario a prepararse mejor para la consulta
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando solicitud...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Solicitar Cita
                                        </>
                                    )}
                                </Button>
                                <Link href="/client/appointments">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> Esta es una solicitud de cita. La clínica revisará tu solicitud
                                    y te confirmará la disponibilidad. Recibirás una notificación cuando tu cita sea confirmada.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
