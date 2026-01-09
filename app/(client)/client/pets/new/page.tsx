"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createPet } from "../actions";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const petSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    species: z.string().min(1, "Selecciona una especie"),
    breed: z.string().min(1, "La raza es requerida"),
    gender: z.string().min(1, "Selecciona el género"),
    dateOfBirth: z.string().optional(),
    color: z.string().optional(),
    microchipNumber: z.string().optional(),
    notes: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

export default function NewPetPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PetFormData>({
        resolver: zodResolver(petSchema),
    });

    const onSubmit = async (data: PetFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const result = await createPet(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("¡Mascota agregada exitosamente!");
                // Redirect is handled by the server action
            }
        } catch (error: any) {
            console.error("Error creating pet:", error);
            toast.error("Error al agregar la mascota");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/client/pets">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agregar Mascota</h1>
                    <p className="text-muted-foreground">
                        Completa la información de tu nueva mascota
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información de la Mascota</CardTitle>
                    <CardDescription>
                        Todos los campos marcados con * son obligatorios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Max, Luna, Firulais"
                                {...register("name")}
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Species and Breed */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="species">Especie *</Label>
                                <Select
                                    onValueChange={(value) => setValue("species", value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Perro">Perro</SelectItem>
                                        <SelectItem value="Gato">Gato</SelectItem>
                                        <SelectItem value="Ave">Ave</SelectItem>
                                        <SelectItem value="Conejo">Conejo</SelectItem>
                                        <SelectItem value="Reptil">Reptil</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.species && (
                                    <p className="text-sm text-red-500">{errors.species.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="breed">Raza *</Label>
                                <Input
                                    id="breed"
                                    placeholder="Ej: Labrador, Siamés"
                                    {...register("breed")}
                                    disabled={loading}
                                />
                                {errors.breed && (
                                    <p className="text-sm text-red-500">{errors.breed.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Gender and Date of Birth */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Género *</Label>
                                <Select
                                    onValueChange={(value) => setValue("gender", value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Macho</SelectItem>
                                        <SelectItem value="female">Hembra</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    {...register("dateOfBirth")}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Color and Microchip */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    placeholder="Ej: Café, Negro, Blanco"
                                    {...register("color")}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="microchipNumber">Número de Microchip</Label>
                                <Input
                                    id="microchipNumber"
                                    placeholder="Ej: 123456789012345"
                                    {...register("microchipNumber")}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas Adicionales</Label>
                            <Textarea
                                id="notes"
                                placeholder="Alergias, comportamiento, información médica relevante..."
                                rows={4}
                                {...register("notes")}
                                disabled={loading}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    "Agregar Mascota"
                                )}
                            </Button>
                            <Link href="/client/pets">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
