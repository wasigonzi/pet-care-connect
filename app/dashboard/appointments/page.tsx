import { getAppointments } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, endOfWeek, addDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export default async function AppointmentsPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const { date } = await searchParams;
    const today = date ? new Date(date) : new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 });

    const appointments = await getAppointments(start, end);

    const days = [];
    let day = start;
    while (day <= end) {
        days.push(day);
        day = addDays(day, 1);
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Citas</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild className="mr-2">
                        <Link href={`?date=${format(addDays(today, -7), 'yyyy-MM-dd')}`}>Semana Anterior</Link>
                    </Button>
                    <Button variant="outline" asChild className="mr-2">
                        <Link href={`?date=${format(addDays(today, 7), 'yyyy-MM-dd')}`}>Siguiente Semana</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/appointments/new">
                            <Plus className="mr-2 h-4 w-4" /> Nueva Cita
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((currentDay, i) => (
                    <Card key={i} className={`min-h-[200px] ${isSameDay(currentDay, new Date()) ? 'border-primary' : ''}`}>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground text-center capitalize">
                                {format(currentDay, "EEE, MMM d", { locale: es })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-2">
                            {appointments
                                ?.filter((apt) => isSameDay(new Date(apt.start_time), currentDay))
                                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                                .map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="flex flex-col rounded bg-accent/50 p-2 text-xs hover:bg-accent cursor-pointer border"
                                    >
                                        <div className="flex items-center gap-1 font-semibold">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(apt.start_time), "HH:mm")}
                                        </div>
                                        <div className="font-medium truncate">{apt.patients?.name}</div>
                                        <div className="text-muted-foreground truncate">{apt.clients?.last_name}</div>
                                        <div className="mt-1 text-[10px] uppercase tracking-wide text-primary/80">
                                            {apt.appointment_type === 'Consultation' && 'Consulta'}
                                            {apt.appointment_type === 'Vaccination' && 'Vacunación'}
                                            {apt.appointment_type === 'Surgery' && 'Cirugía'}
                                            {apt.appointment_type === 'Follow-up' && 'Seguimiento'}
                                            {apt.appointment_type === 'Grooming' && 'Peluquería'}
                                            {!['Consultation', 'Vaccination', 'Surgery', 'Follow-up', 'Grooming'].includes(apt.appointment_type) && apt.appointment_type}
                                        </div>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
