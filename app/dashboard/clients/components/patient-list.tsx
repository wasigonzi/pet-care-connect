"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { AddPatientDialog } from "./add-patient-dialog";
import { useState } from "react";

interface Patient {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    gender: string;
    date_of_birth: string | null;
}

export function PatientList({
    clientId,
    patients,
}: {
    clientId: string;
    patients: Patient[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Mascotas / Pacientes</CardTitle>
                    <CardDescription>
                        Administrar mascotas de este cliente.
                    </CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Mascota
                </Button>
            </CardHeader>
            <CardContent>
                <AddPatientDialog
                    clientId={clientId}
                    open={open}
                    onOpenChange={setOpen}
                />
                <div className="space-y-4">
                    {patients.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No se encontraron mascotas.</div>
                    ) : (
                        patients.map((patient) => (
                            <div
                                key={patient.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{patient.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{patient.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {patient.species} - {patient.breed || "Mezcla desconocida"} (
                                            {patient.gender})
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Ver Ficha
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
