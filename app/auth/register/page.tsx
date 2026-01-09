"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { HeartPulse, Loader2 } from "lucide-react";

const registerSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: `${data.firstName} ${data.lastName}`,
                        phone: data.phone || null,
                    }
                }
            });

            if (authError) {
                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error("No se pudo crear el usuario");
            }

            // 2. Create profile with client role
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    role: 'client',
                    full_name: `${data.firstName} ${data.lastName}`,
                    phone: data.phone || null,
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Continue anyway - profile might be created by trigger
            }

            // 3. Create client record
            const { error: clientError } = await supabase
                .from('clients')
                .insert({
                    user_id: authData.user.id,
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone || null,
                });

            if (clientError) {
                console.error('Client creation error:', clientError);
                // Continue anyway
            }

            toast.success("¡Cuenta creada exitosamente! Bienvenido a Pet Care Connect");

            // Redirect to client dashboard
            router.push('/client');

        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <HeartPulse className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Regístrate para gestionar el cuidado de tus mascotas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombre</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Juan"
                                    {...register("firstName")}
                                    disabled={loading}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Pérez"
                                    {...register("lastName")}
                                    disabled={loading}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                {...register("email")}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono (opcional)</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                {...register("phone")}
                                disabled={loading}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
                            <Link href="/auth/login" className="text-primary hover:underline font-medium">
                                Iniciar Sesión
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
