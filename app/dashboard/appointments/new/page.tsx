import { NewAppointmentForm } from "../components/new-appointment-form";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NewAppointmentPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Nueva Cita</h2>
            </div>
            <div className="grid gap-4 max-w-2xl">
                <NewAppointmentForm />
            </div>
        </div>
    );
}
