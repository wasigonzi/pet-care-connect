import {

// Force dynamic rendering
export const dynamic = 'force-dynamic';
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const roles = [
    { name: "admin", label: "Administrador", description: "Acceso total, gestión de personal, auditoría." },
    { name: "vet", label: "Veterinario", description: "Registros médicos, recetas, cirugías, citas." },
    { name: "assistant", label: "Asistente Vet", description: "Ingreso de pacientes, registros básicos, agenda." },
    { name: "receptionist", label: "Recepcionista", description: "Gestión de clientes, agenda, facturación (básica)." },
];

const capabilities = [
    { name: "Ver Tablero", admin: true, vet: true, assistant: true, receptionist: true },
    { name: "Gestionar Clientes", admin: true, vet: true, assistant: true, receptionist: true },
    { name: "Gestionar Pacientes", admin: true, vet: true, assistant: true, receptionist: true },
    { name: "Historiales Médicos", admin: true, vet: true, assistant: true, receptionist: false },
    { name: "Facturación Completa", admin: true, vet: false, assistant: false, receptionist: true },
    { name: "Gestionar Personal", admin: true, vet: false, assistant: false, receptionist: false },
    { name: "Ver Auditoría", admin: true, vet: false, assistant: false, receptionist: false },
    { name: "Configuración Sistema", admin: true, vet: false, assistant: false, receptionist: false },
];

export default function PermissionsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Permisos del Sistema</h2>
            </div>

            <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/20">
                    <h3 className="text-lg font-medium mb-2">Definiciones de Roles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {roles.map(role => (
                            <div key={role.name} className="p-4 rounded-lg border bg-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="uppercase">{role.name}</Badge>
                                </div>
                                <h4 className="font-bold">{role.label}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Capacidad</TableHead>
                                <TableHead className="text-center">Admin</TableHead>
                                <TableHead className="text-center">Vet</TableHead>
                                <TableHead className="text-center">Asistente</TableHead>
                                <TableHead className="text-center">Recepcionista</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {capabilities.map((cap) => (
                                <TableRow key={cap.name}>
                                    <TableCell className="font-medium">{cap.name}</TableCell>
                                    <TableCell className="text-center">
                                        {cap.admin ? <Check className="h-4 w-4 mx-auto text-green-600" /> : <X className="h-4 w-4 mx-auto text-muted-foreground/30" />}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {cap.vet ? <Check className="h-4 w-4 mx-auto text-green-600" /> : <X className="h-4 w-4 mx-auto text-muted-foreground/30" />}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {cap.assistant ? <Check className="h-4 w-4 mx-auto text-green-600" /> : <X className="h-4 w-4 mx-auto text-muted-foreground/30" />}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {cap.receptionist ? <Check className="h-4 w-4 mx-auto text-green-600" /> : <X className="h-4 w-4 mx-auto text-muted-foreground/30" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
