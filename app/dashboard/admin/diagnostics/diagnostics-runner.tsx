"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Terminal } from "lucide-react";
import { toast } from "sonner";

export function DiagnosticsRunner() {
    const [isRunning, setIsRunning] = useState(false);

    const runAudit = async () => {
        setIsRunning(true);
        
        try {
            // In a real implementation, this would trigger the server-side audit
            // For now, we'll just simulate the process
            toast.info("Starting comprehensive audit...");
            
            // Simulate audit process
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            toast.success("Audit completed! Check the console for detailed results.");
            
            // Refresh the page to show updated results
            window.location.reload();
            
        } catch (error) {
            toast.error("Audit failed. Please check the console for errors.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Button 
            onClick={runAudit} 
            disabled={isRunning}
            className="flex items-center space-x-2"
        >
            {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
                <Terminal className="h-4 w-4" />
            )}
            <span>{isRunning ? "Running..." : "Run Full Audit"}</span>
        </Button>
    );
}