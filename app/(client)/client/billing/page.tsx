import { requireClient } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Eye, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

async function getClientInvoices(clientId: string) {
    const supabase = await createClient();
    
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select(`
            *,
            clients!inner(id, first_name, last_name)
        `)
        .eq('clients.user_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching client invoices:', error);
        return [];
    }

    return invoices || [];
}

export default async function ClientBillingPage() {
    const profile = await requireClient();
    const invoices = await getClientInvoices(profile.id);

    const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'issued');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'issued': return 'bg-blue-100 text-blue-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid': return 'Pagada';
            case 'issued': return 'Pendiente';
            case 'overdue': return 'Vencida';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
                <p className="text-muted-foreground">
                    Gestiona tus facturas y pagos
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {invoices.length} facturas en total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paidInvoices.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ${paidInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingInvoices.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ${pendingInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueInvoices.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ${overdueInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices List */}
            <Card>
                <CardHeader>
                    <CardTitle>Mis Facturas</CardTitle>
                    <CardDescription>
                        Historial completo de facturas y pagos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No hay facturas</h3>
                            <p className="text-muted-foreground">
                                Aún no tienes facturas registradas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium">
                                                    Factura #{invoice.id.slice(0, 8)}
                                                </p>
                                                <Badge className={getStatusColor(invoice.status)}>
                                                    {getStatusText(invoice.status)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(invoice.issue_date).toLocaleDateString('es-ES')}
                                                </span>
                                                {invoice.due_date && (
                                                    <span>
                                                        Vence: {new Date(invoice.due_date).toLocaleDateString('es-ES')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ${(invoice.total_amount || 0).toFixed(2)}
                                            </p>
                                            {invoice.tax_amount && (
                                                <p className="text-sm text-muted-foreground">
                                                    +${invoice.tax_amount.toFixed(2)} impuestos
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                PDF
                                            </Button>
                                            {invoice.status === 'issued' && (
                                                <Button size="sm">
                                                    <CreditCard className="h-4 w-4 mr-1" />
                                                    Pagar
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
        </div>
    );
}