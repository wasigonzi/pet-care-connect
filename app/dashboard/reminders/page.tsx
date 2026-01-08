import { getReminders } from "./actions";
import { RemindersClient } from "./components/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RemindersPage() {
    const reminders = await getReminders();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Recordatorios y Notificaciones</h2>
                {/* Future: Add manual reminder creation */}
            </div>
            <RemindersClient data={reminders || []} />
        </div>
    );
}
