"use client";

import { clockInAction, clockOutAction } from "../actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Play, Square } from "lucide-react";

export function ClockInButton({ currentSession }: { currentSession: any }) {
    const [loading, setLoading] = useState(false);

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const res = await clockInAction();
            if (res?.error) toast.error(res.error);
            else toast.success("Clocked in!");
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        if (!currentSession) return;
        setLoading(true);
        try {
            const res = await clockOutAction(currentSession.id);
            if (res?.error) toast.error(res.error);
            else toast.success("Clocked out!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</Button>;
    }

    if (currentSession) {
        return (
            <Button variant="destructive" size="lg" onClick={handleClockOut}>
                <Square className="mr-2 h-4 w-4 fill-current" /> Clock Out
            </Button>
        );
    }

    return (
        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleClockIn}>
            <Play className="mr-2 h-4 w-4 fill-current" /> Clock In
        </Button>
    );
}
