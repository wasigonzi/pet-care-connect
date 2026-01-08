import { getStaff } from "./actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { StaffClient } from "./components/client";

export default async function StaffPage() {
    const staff = await getStaff();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Personal</h2>
            </div>
            <div className="rounded-md border bg-card">
                <StaffClient data={staff || []} />
            </div>
        </div>
    );
}

