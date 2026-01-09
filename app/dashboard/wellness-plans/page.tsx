import { getWellnessPlans } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, HeartPulse } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function WellnessPlansPage() {
    const plans = await getWellnessPlans();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Planes de Bienestar</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Plan
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre del Plan</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No hay planes de bienestar definidos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans?.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <HeartPulse className="h-4 w-4 text-pink-500" />
                                            {p.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>${p.price}/mes</TableCell>
                                    <TableCell>{p.duration_months} meses</TableCell>
                                    <TableCell>
                                        <Badge variant={p.active ? "default" : "secondary"}>
                                            {p.active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Editar</Button>
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
