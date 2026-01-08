import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getPublishedContent } from "@/app/dashboard/admin/landing/actions";
import { defaultContent } from "@/lib/defaults";
import { themes } from "@/lib/themes";
import { hexToHsl } from "@/lib/utils-colors";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pet Care Connect",
    description: "Veterinary Practice Management System",
    icons: {
        icon: "/favicon.ico",
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch global branding
    const dbContent = await getPublishedContent('home');
    const branding = { ...defaultContent.branding, ...dbContent?.branding };

    // Resolve Primary Color
    // Default to violet if something breaks
    let primaryHsl = themes['violet'];

    if (branding?.primaryColor) {
        if (themes[branding.primaryColor]) {
            primaryHsl = themes[branding.primaryColor];
        } else if (branding.primaryColor.startsWith('#')) {
            primaryHsl = hexToHsl(branding.primaryColor);
        }
    }

    return (
        <html lang="en">
            <body
                className={inter.className}
                suppressHydrationWarning
                style={{
                    '--primary': primaryHsl,
                    '--ring': primaryHsl,
                    // We can also add secondary/muted variations if needed, 
                    // but Shadcn uses opacity modifiers on --primary usually.
                } as React.CSSProperties}
            >
                {children}
                <Toaster />
            </body>
        </html>
    );
}
