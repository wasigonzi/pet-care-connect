import { LoginForm } from "@/components/auth/login-form";
import { SiteBranding } from "@/components/site-branding";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <SiteBranding className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access the platform
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
