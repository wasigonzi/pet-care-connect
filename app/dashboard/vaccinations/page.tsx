import { getVaccinations } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, Syringe } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function VaccinationsPage() {
    const vaccinations = await getVaccinations();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Vacunación</h2>
                <Button asChild>
                    <Link href="/dashboard/vaccinations/new">
                        <Plus className="mr-2 h-4 w-4" /> Registrar Vacuna
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Vacuna</TableHead>
                            <TableHead>Administrada</TableHead>
                            <TableHead>Próx. Dosis</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vaccinations?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No hay registros de vacunación.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vaccinations?.map((v) => {
                                const isOverdue = v.next_due_at && new Date(v.next_due_at) < new Date();
                                return (
                                    <TableRow key={v.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{v.patients?.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {v.patients?.clients?.first_name} {v.patients?.clients?.last_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Syringe className="h-4 w-4 text-muted-foreground" />
                                                {v.vaccine_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(v.administered_at), "MMM d, yyyy", { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            {v.next_due_at
                                                ? format(new Date(v.next_due_at), "MMM d, yyyy", { locale: es })
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {isOverdue ? (
                                                <Badge variant="destructive">Vencida</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vigente</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
