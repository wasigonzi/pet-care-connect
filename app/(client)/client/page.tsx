import { requireClient, getClientRecord } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Dog,
    Calendar,
    CreditCard,
    Plus,
    AlertCircle
} from "lucide-react";

export default async function ClientDashboard() {
    const profile = await requireClient();
    const clientRecord = await getClientRecord();
    const supabase = await createClient();

    // Fetch client's pets
    const { data: pets } = await supabase
        .from('patients')
        .select('*')
        .eq('client_id', clientRecord?.id)
        .limit(5);

    // Fetch upcoming appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*, patients(name)')
        .eq('client_id', clientRecord?.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

    // Fetch pending invoices
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientRecord?.id)
        .eq('status', 'pending')
        .limit(5);

    const stats = [
        {
            title: "Mis Mascotas",
            value: pets?.length || 0,
            icon: Dog,
            href: "/client/pets",
            color: "text-violet-600",
            bgColor: "bg-violet-100",
        },
        {
            title: "Próximas Citas",
            value: appointments?.length || 0,
            icon: Calendar,
            href: "/client/appointments",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
        {
            title: "Facturas Pendientes",
            value: invoices?.length || 0,
            icon: CreditCard,
            href: "/client/billing",
            color: "text-amber-600",
            bgColor: "bg-amber-100",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    ¡Bienvenido, {profile.full_name?.split(' ')[0] || 'Cliente'}!
                </h1>
                <p className="text-muted-foreground">
                    Gestiona el cuidado de tus mascotas desde aquí
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.href}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                    <CardDescription>Gestiona tus mascotas y citas</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Link href="/client/pets/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Mascota
                        </Button>
                    </Link>
                    <Link href="/client/appointments/new">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Solicitar Cita
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            {appointments && appointments.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Próximas Citas</CardTitle>
                        <CardDescription>Tus citas programadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {appointments.map((apt: any) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{apt.patients?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(apt.start_time).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <Link href={`/client/appointments/${apt.id}`}>
                                        <Button variant="ghost" size="sm">
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No tienes citas programadas</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Solicita una cita para el cuidado de tus mascotas
                        </p>
                        <Link href="/client/appointments/new">
                            <Button>
                                <Calendar className="mr-2 h-4 w-4" />
                                Solicitar Cita
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* My Pets Preview */}
            {pets && pets.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Mis Mascotas</CardTitle>
                        <CardDescription>Tus compañeros peludos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pets.map((pet: any) => (
                                <Link key={pet.id} href={`/client/pets/${pet.id}`}>
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-3 rounded-full">
                                                <Dog className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{pet.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {pet.species} • {pet.breed}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Dog className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No tienes mascotas registradas</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Agrega tu primera mascota para comenzar a gestionar su cuidado
                        </p>
                        <Link href="/client/pets/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Mi Primera Mascota
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
