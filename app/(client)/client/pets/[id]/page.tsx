import { requireClient, getClientRecord } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Calendar, FileText, Syringe } from "lucide-react";
import { DeletePetButton } from "./delete-button";

export default async function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await requireClient();
    const clientRecord = await getClientRecord();
    const supabase = await createClient();

    const { data: pet, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .eq("client_id", clientRecord?.id)
        .single();

    if (error || !pet) {
        notFound();
    }

    // Fetch appointments for this pet
    const { data: appointments } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", pet.id)
        .order("datetime", { ascending: false })
        .limit(5);

    // Calculate age
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/client/pets">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{pet.name}</h1>
                        <p className="text-muted-foreground">
                            {pet.species} • {pet.breed}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/client/pets/${pet.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                    <DeletePetButton petId={pet.id} petName={pet.name} />
                </div>
            </div>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                        <p className="text-lg">{pet.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Especie</p>
                        <p className="text-lg">{pet.species}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Raza</p>
                        <p className="text-lg">{pet.breed}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Género</p>
                        <p className="text-lg">
                            {pet.gender === 'male' ? 'Macho' : pet.gender === 'female' ? 'Hembra' : 'No especificado'}
                        </p>
                    </div>
                    {pet.date_of_birth && (
                        <>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                                <p className="text-lg">
                                    {new Date(pet.date_of_birth).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Edad</p>
                                <p className="text-lg">
                                    {calculateAge(pet.date_of_birth)} {calculateAge(pet.date_of_birth) === 1 ? 'año' : 'años'}
                                </p>
                            </div>
                        </>
                    )}
                    {pet.color && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Color</p>
                            <p className="text-lg">{pet.color}</p>
                        </div>
                    )}
                    {pet.microchip_number && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Microchip</p>
                            <p className="text-lg font-mono">{pet.microchip_number}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes */}
            {pet.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notas Adicionales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{pet.notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Recent Appointments */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Historial de Citas</CardTitle>
                            <CardDescription>Últimas citas veterinarias</CardDescription>
                        </div>
                        <Link href="/client/appointments/new">
                            <Button size="sm">
                                <Calendar className="mr-2 h-4 w-4" />
                                Nueva Cita
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {appointments && appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((apt: any) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{apt.reason || 'Consulta General'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(apt.start_time).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {apt.status === 'completed' ? 'Completada' :
                                                apt.status === 'scheduled' ? 'Programada' :
                                                    apt.status === 'cancelled' ? 'Cancelada' :
                                                        apt.status}
                                        </span>
                                    </div>
                                    <Link href={`/client/appointments/${apt.id}`}>
                                        <Button variant="ghost" size="sm">
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No hay citas registradas para {pet.name}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
