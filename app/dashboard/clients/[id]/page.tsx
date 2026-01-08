import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getPatientsByClientId } from "@/app/dashboard/patients/actions";
import { PatientList } from "../components/patient-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

    if (!client) {
        notFound();
    }

    const patients = await getPatientsByClientId(id);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {client.first_name} {client.last_name}
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{client.email || "No email"}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{client.phone || "No phone"}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {client.address}, {client.city}
                                </span>
                            </div>
                            {client.notes && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-4">
                    <PatientList clientId={client.id} patients={patients} />
                </div>
            </div>
        </div>
    );
}
