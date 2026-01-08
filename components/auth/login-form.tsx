"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    );
}

const initialState = {
    error: null as string | null,
};

export function LoginForm() {
    const [state, formAction] = useActionState(login, initialState);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Card>
            <CardHeader></CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground">
                Demo: admin@petcare.com / password
            </CardFooter>
        </Card>
    );
}
