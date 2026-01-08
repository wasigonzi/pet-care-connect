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
import { CheckCircle2, XCircle, Bell, Trash2 } from "lucide-react";
import { updateReminderStatus, deleteReminder } from "../actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RemindersClientProps {
    data: any[];
}

export function RemindersClient({ data }: RemindersClientProps) {
    const handleStatus = async (id: string, status: string) => {
        const result = await updateReminderStatus(id, status);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Recordatorio marcado como ${status}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este recordatorio?")) return;
        const result = await deleteReminder(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Recordatorio eliminado");
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha Vencimiento</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Cliente / Paciente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No se encontraron recordatorios.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((reminder) => (
                            <TableRow key={reminder.id}>
                                <TableCell>
                                    <span className={new Date(reminder.due_date) < new Date() && reminder.status === 'pending' ? "text-red-500 font-bold" : ""}>
                                        {format(new Date(reminder.due_date), "MMM d, yyyy")}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        {reminder.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{reminder.patients?.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {reminder.clients?.first_name} {reminder.clients?.last_name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{reminder.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        reminder.status === 'completed' ? 'default' :
                                            reminder.status === 'pending' ? 'secondary' : 'outline'
                                    }>
                                        {reminder.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Complete"
                                            onClick={() => handleStatus(reminder.id, 'completed')}
                                            disabled={reminder.status === 'completed'}
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Dismiss"
                                            onClick={() => handleStatus(reminder.id, 'dismissed')}
                                            disabled={reminder.status === 'dismissed'}
                                        >
                                            <XCircle className="h-4 w-4 text-orange-400" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(reminder.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
