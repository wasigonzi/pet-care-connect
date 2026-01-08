
import { getPatients } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Dog, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
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

export default async function PatientsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";
    const patients = await getPatients(query);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
                    <p className="text-muted-foreground">
                        Gestiona todos los registros de pacientes aquí.
                    </p>
                </div>

                {/* 
                  Note: A general "New Patient" button usually requires selecting a client first.
                  Ideally, this would link to a client selection screen or a modal.
                  For now, we'll hide it or link to clients page as that's the typical flow 
                  (Start from Client -> Add Patient). Or we could just list existing patients.
                  Let's keeping IT simple: View Only for now, as adding patient usually happens in Client Detail.
                */}
            </div>

            <div className="flex items-center space-x-2">
                <form className="flex-1 max-w-sm relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar pacientes..."
                        name="q"
                        defaultValue={query}
                        className="pl-9"
                    />
                </form>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Especie y Raza</TableHead>
                            <TableHead>Género</TableHead>
                            <TableHead>Propietario</TableHead>
                            <TableHead>Fecha Nacimiento</TableHead>
                            <TableHead className="text-right">Peso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No se encontraron pacientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients?.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <Dog className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/patients/${patient.id}`} className="font-medium hover:underline">
                                                    {patient.name}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">ID: {patient.id.slice(0, 8)}</div>
                                            </div>

                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium capitalize">{patient.species}</span>
                                            <span className="text-xs text-muted-foreground">{patient.breed || "Raza desconocida"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            patient.gender === 'Female' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                                patient.gender === 'Male' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
                                        }>
                                            {patient.gender === 'Female' ? 'Hembra' : patient.gender === 'Male' ? 'Macho' : patient.gender}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {patient.clients ? (
                                            <div className="flex flex-col">
                                                <Link href={`/dashboard/clients/${patient.client_id}`} className="hover:text-primary transition-colors">
                                                    {patient.clients.first_name} {patient.clients.last_name}
                                                </Link>
                                                <span className="text-xs text-muted-foreground">{patient.clients.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">Sin dueño vinculado</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {patient.date_of_birth ? format(new Date(patient.date_of_birth), "MMM d, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {patient.weight ? `${patient.weight} kg` : "-"}
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
