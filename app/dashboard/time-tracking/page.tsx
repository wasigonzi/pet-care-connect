import { getTimeEntries, getLastEntry } from "./actions";
import { ClockInButton } from "./components/clock-in-button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format, differenceInMinutes } from "date-fns";

export default async function TimeTrackingPage() {
    const entries = await getTimeEntries();
    const currentSession = await getLastEntry();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Control de Horario y Asistencia</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Reloj Checador</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="text-4xl font-mono font-bold tracking-wider">
                                {currentSession ? "ENTRADA REGISTRADA" : "SALIDA REGISTRADA"}
                            </div>
                            {currentSession && (
                                <div className="text-sm text-muted-foreground">
                                    Desde: {format(new Date(currentSession.clock_in), "h:mm a")}
                                </div>
                            )}
                            <ClockInButton currentSession={currentSession} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Entrada</TableHead>
                                    <TableHead>Salida</TableHead>
                                    <TableHead>Duración</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries?.slice(0, 5).map((entry) => {
                                    const duration = entry.clock_out
                                        ? differenceInMinutes(new Date(entry.clock_out), new Date(entry.clock_in))
                                        : 0;
                                    const hours = Math.floor(duration / 60);
                                    const mins = duration % 60;

                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>{format(new Date(entry.clock_in), "MMM d")}</TableCell>
                                            <TableCell>{format(new Date(entry.clock_in), "h:mm a")}</TableCell>
                                            <TableCell>{entry.clock_out ? format(new Date(entry.clock_out), "h:mm a") : "-"}</TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {entry.clock_out ? `${hours}h ${mins}m` : "Activo"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
