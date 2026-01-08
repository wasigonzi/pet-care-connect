"use client";

import { updateTaskStatusAction } from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TaskList({ tasks }: { tasks: any[] }) {
    const router = useRouter();

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await updateTaskStatusAction(taskId, newStatus);
            toast.success("Tarea actualizada");
            // Optimistic update via router refresh or local state could be added here
        } catch (e) {
            toast.error("Error al actualizar tarea");
        }
    };

    if (tasks.length === 0) {
        return <div className="text-sm text-muted-foreground p-2">No hay tareas en esta columna.</div>;
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <Card key={task.id} className="bg-muted/30">
                    <CardContent className="p-3 space-y-2">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm">{task.title}</h4>
                            <Badge variant={
                                task.priority === 'urgent' ? 'destructive' :
                                    task.priority === 'high' ? 'default' : 'secondary'
                            } className="text-[10px] px-1 py-0 h-5">
                                {task.priority === 'urgent' ? 'Urgente' :
                                    task.priority === 'high' ? 'Alta' :
                                        task.priority === 'medium' ? 'Media' :
                                            task.priority === 'low' ? 'Baja' : task.priority}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-muted-foreground">
                                {task.due_date ? format(new Date(task.due_date), "MMM d", { locale: es }) : "Sin fecha"}
                            </div>
                            <div className="flex gap-1">
                                {task.status === 'pending' && (
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleStatusChange(task.id, 'in_progress')}>
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                )}
                                {task.status === 'in_progress' && (
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-green-600" onClick={() => handleStatusChange(task.id, 'completed')}>
                                        <Check className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
