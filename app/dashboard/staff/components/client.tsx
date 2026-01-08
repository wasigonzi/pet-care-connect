"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { StaffDialog } from "./staff-dialog";

interface StaffClientProps {
    data: any[];
}

export function StaffClient({ data }: StaffClientProps) {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Se Unió</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No se encontró personal.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback>
                                                {user.full_name
                                                    ? user.full_name.charAt(0).toUpperCase()
                                                    : <User className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {user.full_name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.role === "admin"
                                                ? "default"
                                                : user.role === "vet"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={
                                            user.role === "admin" ? "bg-violet-600" :
                                                user.role === "vet" ? "bg-emerald-600 text-white" : ""
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.created_at
                                        ? format(new Date(user.created_at), "MMM d, yyyy")
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {selectedUser && (
                <StaffDialog
                    key={selectedUser.id} // Reset form when user changes
                    user={selectedUser}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            )}
        </>
    );
}
