import { requireClient } from "@/lib/auth-helpers";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    Dog, 
    FileText, 
    Phone, 
    Mail,
    Edit,
    X,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getAppointmentDetails(appointmentId: string, userId: string) {
    const supabase = await createClient();
    
    const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
            *,
            patients(
                id,
                name,
                species,
                breed,
                clients!inner(id, first_name, last_name, user_id)
            ),
            profiles(full_name)
        `)
        .eq('id', appointmentId)
        .eq('patients.clients.user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching appointment:', error);
        return null;
    }

    return appointment;
}

export default async function AppointmentDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const profile = await requireClient();
    const appointment = await getAppointmentDetails(id, profile.id);

    if (!appointment) {
        notFound();
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-emerald-100 text-emerald-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'scheduled': return 'Programada';
            case 'confirmed': return 'Confirmada';
            case 'in_progress': return 'En Progreso';
            case 'completed': return 'Completada';
            case 'cancelled': return 'Cancelada';
            case 'no_show': return 'No Asistió';
            default: return status;
        }
    };

    const canCancel = appointment.status === 'scheduled' || appointment.status === 'confirmed';
    const canReschedule = appointment.status === 'scheduled';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Detalle de Cita</h1>
                    <p className="text-muted-foreground">
                        Información completa de tu cita médica
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Link href="/client/appointments">
                        <Button variant="outline">
                            Volver a Citas
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Appointment Status */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {appointment.appointment_type}
                                </h2>
                                <p className="text-muted-foreground">
                                    Cita #{appointment.id.slice(0, 8)}
                                </p>
                            </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Appointment Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Cita</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Fecha</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(appointment.start_time).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Hora</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(appointment.start_time).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} - {new Date(appointment.end_time).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Ubicación</p>
                                <p className="text-sm text-muted-foreground">
                                    Clínica Veterinaria Pet Care
                                </p>
                            </div>
                        </div>

                        {appointment.profiles?.full_name && (
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Veterinario</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.profiles.full_name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pet Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Mascota</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Dog className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Nombre</p>
                                <p className="text-sm text-muted-foreground">
                                    {appointment.patients?.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="h-5 w-5 flex items-center justify-center">
                                <div className="h-2 w-2 bg-muted-foreground rounded-full" />
                            </div>
                            <div>
                                <p className="font-medium">Especie</p>
                                <p className="text-sm text-muted-foreground">
                                    {appointment.patients?.species}
                                </p>
                            </div>
                        </div>

                        {appointment.patients?.breed && (
                            <div className="flex items-center space-x-3">
                                <div className="h-5 w-5 flex items-center justify-center">
                                    <div className="h-2 w-2 bg-muted-foreground rounded-full" />
                                </div>
                                <div>
                                    <p className="font-medium">Raza</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.patients.breed}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <Link href={`/client/pets/${appointment.patients?.id}`}>
                                <Button variant="outline" size="sm">
                                    Ver Perfil Completo
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reason and Notes */}
            {(appointment.reason || appointment.notes) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Detalles Adicionales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {appointment.reason && (
                            <div>
                                <p className="font-medium mb-2">Motivo de la Consulta</p>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                    {appointment.reason}
                                </p>
                            </div>
                        )}

                        {appointment.notes && (
                            <div>
                                <p className="font-medium mb-2">Notas</p>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                    {appointment.notes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                    <CardDescription>
                        Opciones disponibles para esta cita
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {canReschedule && (
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Reprogramar
                            </Button>
                        )}

                        {canCancel && (
                            <Button variant="outline" className="text-red-600 hover:text-red-700">
                                <X className="h-4 w-4 mr-2" />
                                Cancelar Cita
                            </Button>
                        )}

                        {appointment.status === 'scheduled' && (
                            <Button>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirmar Asistencia
                            </Button>
                        )}

                        <Button variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar Clínica
                        </Button>

                        <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Mensaje
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Teléfono</p>
                                <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">info@petcare.com</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Dirección</p>
                                <p className="text-sm text-muted-foreground">
                                    123 Calle Principal, Ciudad, Estado 12345
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}