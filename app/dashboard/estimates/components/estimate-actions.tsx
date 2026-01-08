"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Check, ArrowRight } from "lucide-react";
import { convertEstimateToInvoice } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface EstimateActionsProps {
    estimate: any;
}

export function EstimateActions({ estimate }: EstimateActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        if (!confirm("Convert this estimate to an invoice?")) return;

        setLoading(true);
        try {
            const result = await convertEstimateToInvoice(estimate.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Estimate converted to Invoice");
                router.push("/dashboard/billing");
            }
        } catch (e) {
            toast.error("Failed to convert");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/estimates/${estimate.id}`)}>
                    View Details
                </DropdownMenuItem>
                {estimate.status !== 'converted' && estimate.status !== 'declined' && (
                    <DropdownMenuItem onClick={handleConvert} disabled={loading}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Convert to Invoice
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
