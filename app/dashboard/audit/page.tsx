import { getAuditLogs } from "./actions";
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
import { User, Activity, Database } from "lucide-react";

export default async function AuditPage() {
    const logs = await getAuditLogs();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Logs de Auditoría</h2>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Fecha/Hora</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Entidad</TableHead>
                            <TableHead>Detalles</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No se encontraron registros de auditoría.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs?.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs">
                                        {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {log.profiles?.full_name || "Unknown"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {log.profiles?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                log.action === "INSERT"
                                                    ? "default"
                                                    : log.action === "DELETE"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Database className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono text-xs">{log.table_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted p-1 rounded max-w-[300px] block truncate">
                                            {JSON.stringify(log.changes)}
                                        </code>
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

