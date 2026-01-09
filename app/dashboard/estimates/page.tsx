import { getEstimates } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EstimateActions } from "./components/estimate-actions";

export default async function EstimatesPage() {
    const estimates = await getEstimates();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Presupuestos</h2>
                <Button asChild>
                    <Link href="/dashboard/estimates/new">
                        <Plus className="mr-2 h-4 w-4" /> Crear Presupuesto
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                            <TableHead>Válido Hasta</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {estimates?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No hay presupuestos encontrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            estimates?.map((Est) => (
                                <TableRow key={Est.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {Est.clients?.first_name} {Est.clients?.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {Est.clients?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(Est.created_at), "MMM d, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(Est.valid_until), "MMM d, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${Est.total_amount?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            Est.status === 'accepted' ? 'default' :
                                                Est.status === 'declined' ? 'destructive' :
                                                    'secondary'
                                        }>
                                            {Est.status === 'accepted' ? 'Aceptado' :
                                                Est.status === 'declined' ? 'Rechazado' :
                                                    Est.status === 'draft' ? 'Borrador' :
                                                        Est.status === 'sent' ? 'Enviado' : Est.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <EstimateActions estimate={Est} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
