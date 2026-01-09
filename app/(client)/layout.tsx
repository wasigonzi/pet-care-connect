import { requireClient } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteBranding } from "@/components/site-branding";
import {
    Home,
    Dog,
    Calendar,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut
} from "lucide-react";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Require client role - redirects if not client
    const profile = await requireClient();

    const navigation = [
        { name: "Inicio", href: "/client", icon: Home },
        { name: "Mis Mascotas", href: "/client/pets", icon: Dog },
        { name: "Mis Citas", href: "/client/appointments", icon: Calendar },
        { name: "Facturación", href: "/client/billing", icon: CreditCard },
        { name: "Mensajes", href: "/client/communications", icon: MessageSquare },
        { name: "Configuración", href: "/client/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
                <SiteBranding />
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {profile.full_name || "Cliente"}
                    </span>
                    <form action="/api/auth/signout" method="POST">
                        <Button variant="ghost" size="sm" type="submit">
                            <LogOut className="h-4 w-4 mr-2" />
                            Salir
                        </Button>
                    </form>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
