import { requireClient, getClientRecord } from "@/lib/auth-helpers";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dog, Plus, Calendar, FileText } from "lucide-react";

export default async function PetsPage() {
    await requireClient();
    const clientRecord = await getClientRecord();
    const supabase = await createClient();

    const { data: pets, error } = await supabase
        .from("patients")
        .select("*")
        .eq("client_id", clientRecord?.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching pets:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Mascotas</h1>
                    <p className="text-muted-foreground">
                        Gestiona la información de tus compañeros peludos
                    </p>
                </div>
                <Link href="/client/pets/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Mascota
                    </Button>
                </Link>
            </div>

            {pets && pets.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pets.map((pet: any) => (
                        <Link key={pet.id} href={`/client/pets/${pet.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-3 rounded-full">
                                                <Dog className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{pet.name}</CardTitle>
                                                <CardDescription>
                                                    {pet.species} • {pet.breed}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-medium">Género:</span>
                                        <span>{pet.gender === 'male' ? 'Macho' : pet.gender === 'female' ? 'Hembra' : 'No especificado'}</span>
                                    </div>
                                    {pet.date_of_birth && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(pet.date_of_birth).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {pet.color && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="font-medium">Color:</span>
                                            <span>{pet.color}</span>
                                        </div>
                                    )}
                                    <div className="pt-2">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Dog className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No tienes mascotas registradas</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Agrega tu primera mascota para comenzar a gestionar su información médica,
                            vacunas y citas veterinarias.
                        </p>
                        <Link href="/client/pets/new">
                            <Button size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                Agregar Mi Primera Mascota
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
