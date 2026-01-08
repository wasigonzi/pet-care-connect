import { getDashboardMetrics } from "./actions";
import { DollarSign, Users, Calendar, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="flex flex-col gap-4 p-8 pt-6">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Panel de Control</h1>
            <p className="text-muted-foreground">Bienvenido al Panel de Control de la Clínica.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/30">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">${metrics.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total histórico</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{metrics.patients}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total registrados</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/30">
                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{metrics.appointments}</div>
                        <p className="text-xs text-muted-foreground mt-1">Programadas para hoy</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                        <div className="p-2 bg-orange-100 rounded-full dark:bg-orange-900/30">
                            <CheckSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{metrics.tasks}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
