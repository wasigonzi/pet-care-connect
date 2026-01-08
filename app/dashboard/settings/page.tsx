import { getMyProfile } from "./actions";
import { ProfileForm } from "./components/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
    const profile = await getMyProfile();

    if (!profile) return <div>Please log in</div>;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Mi Perfil</CardTitle>
                        <CardDescription>
                            Administra la configuración de tu cuenta personal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm profile={profile} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Info Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Tu Rol</span>
                            <Badge variant="outline" className="uppercase">{profile.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Versión</span>
                            <span className="text-sm text-muted-foreground">v1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Build</span>
                            <span className="text-sm text-muted-foreground">Producción</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
