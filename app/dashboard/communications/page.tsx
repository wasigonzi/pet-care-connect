import { getLogs, getTemplates } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Mail, MessageSquare, Bell } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function CommunicationsPage() {
    const logs = await getLogs();
    const templates = await getTemplates();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
                <Button asChild>
                    <Link href="/dashboard/communications/new">
                        <Plus className="mr-2 h-4 w-4" /> Send Message
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="logs" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="logs" className="space-y-4">
                    <div className="space-y-4">
                        {logs?.length === 0 ? (
                            <p className="text-muted-foreground">No communication logs found.</p>
                        ) : (
                            logs?.map((log) => (
                                <Card key={log.id}>
                                    <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                                        <div className="flex items-center gap-2">
                                            {log.type === 'email' && <Mail className="h-4 w-4" />}
                                            {log.type === 'sms' && <MessageSquare className="h-4 w-4" />}
                                            {log.type === 'notification' && <Bell className="h-4 w-4" />}
                                            <span className="font-semibold">{log.clients?.first_name} {log.clients?.last_name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), "MMM d, h:mm a")}</span>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-sm space-y-1">
                                        {log.subject && <div className="font-medium">{log.subject}</div>}
                                        <div className="text-muted-foreground">{log.content}</div>
                                        <div className="pt-2">
                                            <Badge variant={log.status === 'sent' ? 'default' : 'secondary'}>{log.status}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="templates" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates?.map((template) => (
                            <Card key={template.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                    <CardDescription className="capitalize">{template.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {template.content_template}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
