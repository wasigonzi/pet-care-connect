"use client";

import { createPatientAction } from "@/app/dashboard/patients/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export function AddPatientDialog({
    clientId,
    open,
    onOpenChange,
}: {
    clientId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append("client_id", clientId);

        const result = await createPatientAction(null, formData);
        setLoading(false);

        if (result?.error) {
            toast.error("Error al agregar paciente");
        } else {
            toast.success("Paciente agregado exitosamente");
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
                    <DialogDescription>
                        Agregue una nueva mascota al perfil de este cliente.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="species" className="text-right">
                                Especie
                            </Label>
                            <Select name="species" defaultValue="Dog">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar especie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dog">Perro</SelectItem>
                                    <SelectItem value="Cat">Gato</SelectItem>
                                    <SelectItem value="Bird">Ave</SelectItem>
                                    <SelectItem value="Other">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="breed" className="text-right">
                                Raza
                            </Label>
                            <Input id="breed" name="breed" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender" className="text-right">
                                Género
                            </Label>
                            <Select name="gender" defaultValue="Unknown">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar género" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Macho</SelectItem>
                                    <SelectItem value="Female">Hembra</SelectItem>
                                    <SelectItem value="Unknown">Desconocido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Agregando..." : "Agregar Paciente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
