import { getTasks, updateTaskStatusAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Circle, Clock } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TaskList } from "./components/task-list";

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                <Button asChild>
                    <Link href="/dashboard/tasks/new">
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Circle className="h-5 w-5 text-slate-500" /> To Do
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskList tasks={tasks?.filter(t => t.status === 'pending') || []} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" /> In Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskList tasks={tasks?.filter(t => t.status === 'in_progress') || []} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" /> Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskList tasks={tasks?.filter(t => t.status === 'completed') || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
