import { EstimateForm } from "../components/estimate-form";

export default function NewEstimatePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Presupuesto</h2>
            </div>
            <div className="rounded-md border p-6">
                <EstimateForm />
            </div>
        </div>
    );
}
