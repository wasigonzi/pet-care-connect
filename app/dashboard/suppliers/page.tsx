import { getSuppliers } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SuppliersClient } from "./components/client";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
                <Button asChild>
                    <Link href="/dashboard/suppliers/new">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Proveedor
                    </Link>
                </Button>
            </div>

            <SuppliersClient data={suppliers || []} />
        </div>
    );
}
