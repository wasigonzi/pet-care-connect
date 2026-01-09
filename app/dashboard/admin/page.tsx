import { getTimeEntries, getLastEntry } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
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

export default async function AdminPage() {
    const entries = await getTimeEntries();
    const currentSession = await getLastEntry();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Time Tracking & Admin</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Time Clock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="text-4xl font-mono font-bold tracking-wider">
                                {currentSession ? "CLOCKED IN" : "CLOCKED OUT"}
                            </div>
                            {currentSession && (
                                <div className="text-sm text-muted-foreground">
                                    Since: {format(new Date(currentSession.clock_in), "h:mm a")}
                                </div>
                            )}
                            <ClockInButton currentSession={currentSession} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>In</TableHead>
                                    <TableHead>Out</TableHead>
                                    <TableHead>Duration</TableHead>
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
                                                {entry.clock_out ? `${hours}h ${mins}m` : "Active"}
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
