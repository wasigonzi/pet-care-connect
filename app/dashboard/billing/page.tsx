import { getInvoices } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, FileText } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function BillingPage() {
    const invoices = await getInvoices();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Billing & Invoices</h2>
                <Button asChild>
                    <Link href="/dashboard/billing/new">
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices?.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono">{inv.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {inv.clients?.first_name} {inv.clients?.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {inv.clients?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(inv.created_at), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(inv.due_date), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${inv.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            inv.status === 'paid' ? 'default' :
                                                inv.status === 'overdue' ? 'destructive' :
                                                    inv.status === 'draft' ? 'secondary' : 'outline'
                                        } className={inv.status === 'paid' ? 'bg-green-600' : ''}>
                                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
