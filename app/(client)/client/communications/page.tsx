import { requireClient } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone, Calendar, User, Reply } from "lucide-react";

async function getClientCommunications(clientId: string) {
    const supabase = await createClient();
    
    const { data: communications, error } = await supabase
        .from('communications')
        .select(`
            *,
            clients!inner(id, first_name, last_name),
            profiles(full_name)
        `)
        .eq('clients.user_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching communications:', error);
        return [];
    }

    return communications || [];
}

export default async function ClientCommunicationsPage() {
    const profile = await requireClient();
    const communications = await getClientCommunications(profile.id);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail className="h-4 w-4" />;
            case 'phone': return <Phone className="h-4 w-4" />;
            case 'sms': return <MessageSquare className="h-4 w-4" />;
            default: return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'email': return 'bg-blue-100 text-blue-800';
            case 'phone': return 'bg-green-100 text-green-800';
            case 'sms': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'email': return 'Email';
            case 'phone': return 'Llamada';
            case 'sms': return 'SMS';
            default: return type;
        }
    };

    const getDirectionColor = (direction: string) => {
        switch (direction) {
            case 'incoming': return 'bg-green-50 border-green-200';
            case 'outgoing': return 'bg-blue-50 border-blue-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getDirectionText = (direction: string) => {
        switch (direction) {
            case 'incoming': return 'Recibido';
            case 'outgoing': return 'Enviado';
            default: return direction;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
                <p className="text-muted-foreground">
                    Historial de comunicaciones con la clínica
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mensajes</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{communications.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Todas las comunicaciones
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {communications.filter(c => c.type === 'email').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Correos electrónicos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Llamadas</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {communications.filter(c => c.type === 'phone').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Llamadas telefónicas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Communications List */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Comunicaciones</CardTitle>
                    <CardDescription>
                        Todas las comunicaciones entre tú y la clínica
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {communications.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No hay mensajes</h3>
                            <p className="text-muted-foreground">
                                Aún no tienes comunicaciones registradas.
                            </p>
                            <Button className="mt-4">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Enviar Mensaje
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {communications.map((comm) => (
                                <div
                                    key={comm.id}
                                    className={`p-4 border rounded-lg ${getDirectionColor(comm.direction)}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getTypeIcon(comm.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Badge className={getTypeColor(comm.type)}>
                                                        {getTypeText(comm.type)}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {getDirectionText(comm.direction)}
                                                    </Badge>
                                                    {comm.subject && (
                                                        <span className="font-medium text-sm">
                                                            {comm.subject}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(comm.created_at).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {comm.profiles?.full_name && (
                                                        <span className="flex items-center">
                                                            <User className="h-4 w-4 mr-1" />
                                                            {comm.profiles.full_name}
                                                        </span>
                                                    )}
                                                </div>

                                                {comm.content && (
                                                    <div className="bg-white/50 p-3 rounded border">
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {comm.content}
                                                        </p>
                                                    </div>
                                                )}

                                                {comm.notes && (
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <strong>Notas:</strong> {comm.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            {comm.type === 'email' && comm.direction === 'incoming' && (
                                                <Button variant="outline" size="sm">
                                                    <Reply className="h-4 w-4 mr-1" />
                                                    Responder
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Contactar Clínica</CardTitle>
                    <CardDescription>
                        Formas rápidas de comunicarte con nosotros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Button variant="outline" className="h-auto p-4">
                            <div className="text-center">
                                <Mail className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium">Enviar Email</div>
                                <div className="text-sm text-muted-foreground">
                                    Consulta general
                                </div>
                            </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4">
                            <div className="text-center">
                                <Phone className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium">Llamar</div>
                                <div className="text-sm text-muted-foreground">
                                    (555) 123-4567
                                </div>
                            </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4">
                            <div className="text-center">
                                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium">Chat</div>
                                <div className="text-sm text-muted-foreground">
                                    Mensaje directo
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}