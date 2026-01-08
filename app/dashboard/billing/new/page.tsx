import { InvoiceForm } from "../components/invoice-form";

export default function NewInvoicePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
            </div>
            <div className="max-w-4xl">
                <InvoiceForm />
            </div>
        </div>
    );
}
