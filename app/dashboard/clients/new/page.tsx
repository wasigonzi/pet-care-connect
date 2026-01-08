import { ClientForm } from "../components/client-form";

export default function NewClientPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">New Client</h2>
            </div>
            <div className="grid gap-4 max-w-2xl">
                <ClientForm />
            </div>
        </div>
    );
}
