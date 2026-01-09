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
    title: "Pet Care Connect - Sistema de Gestión Veterinaria",
    description: "Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos, facturación y comunicación con clientes de manera eficiente y segura.",
    keywords: "veterinaria, clínica veterinaria, gestión veterinaria, mascotas, animales, citas veterinarias, historial médico, vacunas, tratamientos",
    authors: [{ name: "Pet Care Connect" }],
    creator: "Pet Care Connect",
    publisher: "Pet Care Connect",
    robots: "index, follow",
    openGraph: {
        title: "Pet Care Connect - Sistema de Gestión Veterinaria",
        description: "Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos y más.",
        type: "website",
        locale: "es_ES",
        siteName: "Pet Care Connect"
    },
    twitter: {
        card: "summary_large_image",
        title: "Pet Care Connect - Sistema de Gestión Veterinaria",
        description: "Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos y más."
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/icon.svg",
        apple: "/icon.svg"
    },
    manifest: "/manifest.json"
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch global branding securely
    let branding = { ...defaultContent.branding };
    try {
        const dbContent = await getPublishedContent('home');
        branding = { ...branding, ...dbContent?.branding };
    } catch (e) {
        console.error("Layout branding fetch failed:", e);
    }

    // Resolve Primary Color
    // Default to violet if something breaks
    let primaryHsl = themes['violet'];

    if (branding?.primaryColor) {
        if (themes[branding.primaryColor]) {
            primaryHsl = themes[branding.primaryColor];
        } else if (branding.primaryColor.startsWith('#')) {
            try {
                primaryHsl = hexToHsl(branding.primaryColor);
            } catch (e) {
                console.error("Invalid hex color:", branding.primaryColor);
                primaryHsl = themes['violet'];
            }
        }
    }

    return (
        <html lang="es">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#8b5cf6" />
                <link rel="canonical" href="https://petcareconnect.com" />
            </head>
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
