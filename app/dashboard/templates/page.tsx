import { getTemplates } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
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

export default async function TemplatesPage() {
    const templates = await getTemplates();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Plantillas Clínicas</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Plantilla
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron plantillas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates?.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {t.name}
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                                    <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
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
