import { getRecords } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function RecordsPage() {
    const records = await getRecords();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Registros Médicos</h2>
                <Button asChild>
                    <Link href="/dashboard/records/new">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {records?.length === 0 ? (
                    <p className="text-muted-foreground">No se encontraron registros.</p>
                ) : (
                    records?.map((record) => (
                        <Card key={record.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    {record.patients?.name} ({record.patients?.species})
                                </CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    {format(new Date(record.date), "MMM d, yyyy")}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{record.diagnosis || "No diagnosis"}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {record.subjective} {record.objective} {record.assessment} {record.plan}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
