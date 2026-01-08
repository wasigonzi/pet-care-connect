import { getPatient } from "./actions";
import { Button } from "@/components/ui/button";
import {
    Dog,
    Cat,
    Activity,
    Calendar,
    Syringe,
    FileText,
    User,
    ArrowLeft,
    Clock,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";

export default async function PatientDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const patient = await getPatient(id);

    if (!patient) {
        return <div>Paciente no encontrado</div>;
    }

    const ageYears = patient.date_of_birth ? differenceInYears(new Date(), new Date(patient.date_of_birth)) : 0;
    const ageMonths = patient.date_of_birth ? differenceInMonths(new Date(), new Date(patient.date_of_birth)) % 12 : 0;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/patients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{patient.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="capitalize">{patient.species}</span>
                        <span>•</span>
                        <span>{patient.breed}</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href={`/dashboard/appointments/new?patientId=${patient.id}`}>
                            <Calendar className="mr-2 h-4 w-4" /> Agendar Cita
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href={`/dashboard/records/new?patientId=${patient.id}`}>
                            <FileText className="mr-2 h-4 w-4" /> Nuevo Registro
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dueño</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            <Link href={`/dashboard/clients/${patient.clients?.id}`} className="hover:underline">
                                {patient.clients?.first_name} {patient.clients?.last_name}
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" title={patient.clients?.email}>
                            {patient.clients?.email}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Edad</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {ageYears}a {ageMonths}m
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Nacido {patient.date_of_birth ? format(new Date(patient.date_of_birth), "MMM d, yyyy", { locale: es }) : "-"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Peso</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patient.weight || "-"} kg</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estado</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {patient.is_deceased ? <Badge variant="destructive">Fallecido</Badge> : <Badge variant="default" className="bg-emerald-600">Activo</Badge>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="clinical" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="clinical">Historial Clínico</TabsTrigger>
                    <TabsTrigger value="vaccines">Vacunación</TabsTrigger>
                    <TabsTrigger value="appointments">Citas</TabsTrigger>
                    <TabsTrigger value="info">Info y Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="clinical" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial Médico</CardTitle>
                            <CardDescription>Consultas y tratamientos pasados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {patient.medical_records?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No se encontraron registros médicos.</p>
                            ) : (
                                patient.medical_records?.map((record: any) => (
                                    <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card/50">
                                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">{record.diagnosis || "Consulta"}</h4>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(record.date), "PPP", { locale: es })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{record.treatment}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="vaccines" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registro de Vacunación</CardTitle>
                            <CardDescription>Historial de inmunización y fechas de vencimiento.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {patient.vaccinations?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No se encontraron vacunas registradas.</p>
                                ) : (
                                    patient.vaccinations?.map((vac: any) => {
                                        const isDue = vac.next_due_at && new Date(vac.next_due_at) < new Date();
                                        return (
                                            <div key={vac.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Syringe className="h-5 w-5 text-purple-500" />
                                                    <div>
                                                        <p className="font-medium">{vac.vaccine_name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Aplicada: {format(new Date(vac.administered_at), "MMM d, yyyy", { locale: es })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {vac.next_due_at ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-muted-foreground">Próx. Dosis</span>
                                                            <span className={isDue ? "text-red-600 font-bold" : "font-medium"}>
                                                                {format(new Date(vac.next_due_at), "MMM d, yyyy", { locale: es })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="secondary">Sin seguimiento</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Citas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {patient.appointments?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No se encontraron citas.</p>
                                ) : (
                                    patient.appointments?.map((appt: any) => (
                                        <div key={appt.id} className="flex items-center justify-between p-3 border-b last:border-0">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{format(new Date(appt.start_time), "MMM d, yyyy h:mm a", { locale: es })}</span>
                                                <span className="text-sm text-muted-foreground">{appt.appointment_type}</span>
                                            </div>
                                            <Badge variant={appt.status === 'completed' ? 'default' : 'outline'}>
                                                {appt.status}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Paciente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Microchip</label>
                                    <div className="font-mono">{patient.microchip_number || "Sin microchip"}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Color / Señas</label>
                                    <div>{patient.notes || "-"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
