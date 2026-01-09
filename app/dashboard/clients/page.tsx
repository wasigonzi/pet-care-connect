import { getClients } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { ClientTable } from "./components/client-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function ClientsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";
    const clients = await getClients(query);

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">
                        Gestiona los clientes de la clínica y sus mascotas.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/dashboard/clients/new">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Cliente
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <form className="flex-1 max-w-sm">
                    <Input placeholder="Buscar clientes..." name="q" defaultValue={query} />
                </form>
            </div>

            <ClientTable clients={clients} />
        </div>
    );
}
