import { getVaccinations } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Syringe } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function VaccinationsPage() {
    const vaccinations = await getVaccinations();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Vaccinations</h2>
                <Button asChild>
                    <Link href="/dashboard/vaccinations/new">
                        <Plus className="mr-2 h-4 w-4" /> Log Vaccination
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Vaccine</TableHead>
                            <TableHead>Administered</TableHead>
                            <TableHead>Next Due</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vaccinations?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No vaccination records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vaccinations?.map((v) => {
                                const isOverdue = v.date_next_due && new Date(v.date_next_due) < new Date();
                                return (
                                    <TableRow key={v.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{v.patients?.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {v.patients?.clients?.first_name} {v.patients?.clients?.last_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Syringe className="h-4 w-4 text-muted-foreground" />
                                                {v.vaccine_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(v.date_administered), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            {v.date_next_due
                                                ? format(new Date(v.date_next_due), "MMM d, yyyy")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {isOverdue ? (
                                                <Badge variant="destructive">Overdue</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Valid</Badge>
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
