import { requireClient, getClientRecord } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default async function AppointmentsPage() {
    await requireClient();
    const clientRecord = await getClientRecord();
    const supabase = await createClient();

    const { data: appointments, error } = await supabase
        .from("appointments")
        .select(`
            *,
            patients (
                id,
                name,
                species,
                breed
            )
        `)
        .eq("client_id", clientRecord?.id)
        .order("start_time", { ascending: false });

    if (error) {
        console.error("Error fetching appointments:", error);
    }

    const now = new Date();
    const upcoming = appointments?.filter(apt => new Date(apt.start_time) >= now && apt.status !== 'cancelled') || [];
    const past = appointments?.filter(apt => new Date(apt.start_time) < now || apt.status === 'completed') || [];
    const cancelled = appointments?.filter(apt => apt.status === 'cancelled') || [];

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { icon: any; class: string; label: string }> = {
            scheduled: { icon: Clock, class: "bg-blue-100 text-blue-800", label: "Programada" },
            confirmed: { icon: CheckCircle, class: "bg-green-100 text-green-800", label: "Confirmada" },
            in_progress: { icon: Clock, class: "bg-amber-100 text-amber-800", label: "En Progreso" },
            completed: { icon: CheckCircle, class: "bg-green-100 text-green-800", label: "Completada" },
            cancelled: { icon: XCircle, class: "bg-red-100 text-red-800", label: "Cancelada" },
            no_show: { icon: AlertCircle, class: "bg-gray-100 text-gray-800", label: "No Asistió" },
        };
        const badge = badges[status] || badges.scheduled;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                <Icon className="h-3 w-3" />
                {badge.label}
            </span>
        );
    };

    const AppointmentCard = ({ apt }: { apt: any }) => (
        <Link href={`/client/appointments/${apt.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{apt.patients?.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {apt.patients?.species} • {apt.patients?.breed}
                            </p>
                            <p className="text-sm font-medium text-primary mb-2">
                                {apt.reason || "Consulta General"}
                            </p>
                        </div>
                        {getStatusBadge(apt.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(apt.start_time).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
                    <p className="text-muted-foreground">
                        Gestiona las citas veterinarias de tus mascotas
                    </p>
                </div>
                <Link href="/client/appointments/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Solicitar Cita
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="upcoming">
                        Próximas ({upcoming.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                        Pasadas ({past.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                        Canceladas ({cancelled.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcoming.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcoming.map((apt) => (
                                <AppointmentCard key={apt.id} apt={apt} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No tienes citas próximas</h3>
                                <p className="text-muted-foreground text-center mb-6 max-w-md">
                                    Solicita una cita para el cuidado veterinario de tus mascotas
                                </p>
                                <Link href="/client/appointments/new">
                                    <Button size="lg">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Solicitar Cita
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {past.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {past.map((apt) => (
                                <AppointmentCard key={apt.id} apt={apt} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No hay citas pasadas</h3>
                                <p className="text-muted-foreground text-center">
                                    Aquí aparecerán las citas completadas
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4">
                    {cancelled.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {cancelled.map((apt) => (
                                <AppointmentCard key={apt.id} apt={apt} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No hay citas canceladas</h3>
                                <p className="text-muted-foreground text-center">
                                    Aquí aparecerán las citas que hayas cancelado
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
