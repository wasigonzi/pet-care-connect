import { requireClient } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Smartphone, Mail, Lock } from "lucide-react";

async function getClientData(userId: string) {
    const supabase = await createClient();
    
    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    // Get client record
    const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .single();

    return { profile, client };
}

export default async function ClientSettingsPage() {
    const profile = await requireClient();
    const { client } = await getClientData(profile.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">
                    Gestiona tu perfil y preferencias de cuenta
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Información Personal
                    </CardTitle>
                    <CardDescription>
                        Actualiza tu información de contacto y perfil
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                                id="firstName"
                                defaultValue={client?.first_name || ''}
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input
                                id="lastName"
                                defaultValue={client?.last_name || ''}
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue={client?.email || ''}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            type="tel"
                            defaultValue={client?.phone || ''}
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea
                            id="address"
                            defaultValue={client?.address || ''}
                            placeholder="Tu dirección completa"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                            id="city"
                            defaultValue={client?.city || ''}
                            placeholder="Tu ciudad"
                        />
                    </div>

                    <Button>
                        Guardar Cambios
                    </Button>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Notificaciones
                    </CardTitle>
                    <CardDescription>
                        Configura cómo quieres recibir notificaciones
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Label className="text-base font-medium">Notificaciones por Email</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recibe recordatorios de citas y actualizaciones por email
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Label className="text-base font-medium">Notificaciones SMS</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recibe recordatorios de citas por mensaje de texto
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Recordatorios de Vacunación</Label>
                            <p className="text-sm text-muted-foreground">
                                Notificaciones cuando las vacunas de tus mascotas estén próximas a vencer
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Promociones y Ofertas</Label>
                            <p className="text-sm text-muted-foreground">
                                Recibe información sobre promociones especiales y descuentos
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Seguridad
                    </CardTitle>
                    <CardDescription>
                        Gestiona la seguridad de tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium">Cambiar Contraseña</Label>
                            <p className="text-sm text-muted-foreground">
                                Actualiza tu contraseña regularmente para mayor seguridad
                            </p>
                        </div>
                        <Button variant="outline">
                            <Lock className="h-4 w-4 mr-2" />
                            Cambiar
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium">Autenticación de Dos Factores</Label>
                            <p className="text-sm text-muted-foreground">
                                Añade una capa extra de seguridad a tu cuenta
                            </p>
                        </div>
                        <Button variant="outline">
                            Configurar
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium">Sesiones Activas</Label>
                            <p className="text-sm text-muted-foreground">
                                Ve y gestiona los dispositivos donde has iniciado sesión
                            </p>
                        </div>
                        <Button variant="outline">
                            Ver Sesiones
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Métodos de Pago
                    </CardTitle>
                    <CardDescription>
                        Gestiona tus métodos de pago para facturas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center py-8">
                        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No hay métodos de pago</h3>
                        <p className="text-muted-foreground mb-4">
                            Añade una tarjeta de crédito o débito para pagos automáticos
                        </p>
                        <Button>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Añadir Método de Pago
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                    <CardDescription>
                        Acciones irreversibles para tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium">Desactivar Cuenta</Label>
                            <p className="text-sm text-muted-foreground">
                                Desactiva temporalmente tu cuenta. Podrás reactivarla más tarde.
                            </p>
                        </div>
                        <Button variant="outline">
                            Desactivar
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-medium text-red-600">Eliminar Cuenta</Label>
                            <p className="text-sm text-muted-foreground">
                                Elimina permanentemente tu cuenta y todos los datos asociados.
                            </p>
                        </div>
                        <Button variant="destructive">
                            Eliminar Cuenta
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}