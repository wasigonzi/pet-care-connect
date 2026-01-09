import { getInventory } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
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

export default async function InventoryPage() {
    const inventory = await getInventory();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
                <Button asChild>
                    <Link href="/dashboard/inventory/new">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Ítem
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No se encontraron ítems de inventario.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inventory?.map((item) => {
                                const isLowStock = item.reorder_level && item.quantity <= item.reorder_level;
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-xs">{item.sku || "-"}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                {item.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.category === 'Medication' ? 'Medicamento' :
                                                item.category === 'Consumable' ? 'Consumible' :
                                                    item.category === 'Equipment' ? 'Equipo' :
                                                        item.category === 'Food' ? 'Alimento' :
                                                            item.category === 'Other' ? 'Otro' : item.category}
                                        </TableCell>
                                        <TableCell>
                                            {item.quantity} {item.unit}
                                        </TableCell>
                                        <TableCell>
                                            {item.selling_price ? `$${item.selling_price.toFixed(2)}` : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {isLowStock ? (
                                                <Badge variant="destructive">Stock Bajo</Badge>
                                            ) : (
                                                <Badge variant="secondary">En Stock</Badge>
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
