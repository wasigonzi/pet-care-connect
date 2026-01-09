import { getInvoices } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, FileText } from "lucide-react";
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

export default async function BillingPage() {
    const invoices = await getInvoices();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Facturación</h2>
                <Button asChild>
                    <Link href="/dashboard/billing/new">
                        <Plus className="mr-2 h-4 w-4" /> Crear Factura
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Factura #</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Fecha Vencimiento</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No se encontraron facturas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices?.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono">{inv.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {inv.clients?.first_name} {inv.clients?.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {inv.clients?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(inv.created_at), "MMM d, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(inv.due_date), "MMM d, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${inv.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'paid' ? 'default' :
                                                inv.status === 'overdue' ? 'destructive' :
                                                    inv.status === 'draft' ? 'secondary' : 'outline'
                                        } className={inv.status === 'paid' ? 'bg-green-600' : ''}>
                                            {inv.status === 'paid' ? 'Pagado' :
                                                inv.status === 'overdue' ? 'Vencido' :
                                                    inv.status === 'draft' ? 'Borrador' :
                                                        inv.status === 'issued' ? 'Emitida' :
                                                            inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <FileText className="h-4 w-4" />
                                        </Button>
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
