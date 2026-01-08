"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";

export function ProfileForm({ profile }: { profile: any }) {
    const [isPending, startTransition] = useTransition();

    const onSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Perfil actualizado");
            }
        });
    };

    return (
        <form action={onSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">El email no se puede cambiar.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="full_name">Nombre Completo</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile.full_name || ""}
                    required
                    minLength={2}
                />
            </div>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </form>
    );
}
