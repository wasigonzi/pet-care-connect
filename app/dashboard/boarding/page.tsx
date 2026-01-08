import { getReservations, getUnits } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Home, Calendar } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function BoardingPage() {
    const reservations = await getReservations();
    const units = await getUnits();

    // Simple availability calculation could be done here or in a separate view
    // For now, we list reservations and units

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Hospedaje</h2>
                <Button asChild>
                    <Link href="/dashboard/boarding/new">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Reservación
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {units?.map(unit => (
                    <Card key={unit.id} className="bg-muted/40">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {unit.name}
                            </CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{unit.type}</div>
                            <p className="text-xs text-muted-foreground capitalize">
                                {unit.size} · {unit.status}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Reservaciones</h3>
                {reservations?.length === 0 ? (
                    <p className="text-muted-foreground">No se encontraron reservaciones.</p>
                ) : (
                    reservations?.map((res) => (
                        <Card key={res.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{res.patients?.name} ({res.patients?.species})</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(res.start_date), "MMM d")} - {format(new Date(res.end_date), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{res.boarding_units?.name}</p>
                                        <p className="text-xs text-muted-foreground">{res.patients?.clients?.last_name}</p>
                                    </div>
                                    <Badge variant={res.status === 'confirmed' ? 'default' : 'outline'}>
                                        {res.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
