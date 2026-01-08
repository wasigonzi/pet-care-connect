import { getCommunications } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Mail, Phone } from "lucide-react";
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

export default async function CommunicationsPage() {
    const comms = await getCommunications();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Comunicaciones</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Mensaje
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Asunto</TableHead>
                            <TableHead>Personal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comms?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron registros de comunicación.
                                </TableCell>
                            </TableRow>
                        ) : (
                            comms?.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{format(new Date(c.sent_at), "MMM d, HH:mm", { locale: es })}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {c.type === 'email' && <Mail className="h-3 w-3 mr-1 inline" />}
                                            {c.type === 'phone_call' && <Phone className="h-3 w-3 mr-1 inline" />}
                                            {c.type === 'email' ? 'Correo' :
                                                c.type === 'phone_call' ? 'Llamada' :
                                                    c.type === 'sms' ? 'SMS' :
                                                        c.type === 'notification' ? 'Notificación' : c.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{c.clients?.first_name} {c.clients?.last_name}</TableCell>
                                    <TableCell>{c.subject}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {c.profiles?.full_name || "Sistema"}
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
