"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Phone, Mail, Globe } from "lucide-react";
import { deleteSupplierAction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SuppliersClientProps {
    data: any[];
}

export function SuppliersClient({ data }: SuppliersClientProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de que desea eliminar este proveedor?")) return;

        const result = await deleteSupplierAction(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Proveedor eliminado");
            router.refresh();
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Datos Contacto</TableHead>
                        <TableHead>RFC/Tax ID</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No se encontraron proveedores.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((supplier) => (
                            <TableRow key={supplier.id}>
                                <TableCell className="font-medium">
                                    {supplier.name}
                                    {supplier.website && (
                                        <a
                                            href={supplier.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="ml-2 inline-block text-muted-foreground hover:text-primary"
                                            aria-label={`Visit website of ${supplier.name}`}
                                        >
                                            <Globe className="h-3 w-3" />
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>{supplier.contact_name || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                        {supplier.email && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                <span>{supplier.email}</span>
                                            </div>
                                        )}
                                        {supplier.phone && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                <span>{supplier.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{supplier.tax_id || "-"}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(supplier.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
