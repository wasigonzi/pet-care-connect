import { getPublishedContent } from "@/app/dashboard/admin/landing/actions";
import { defaultContent } from "@/lib/defaults";
import { HeartPulse } from "lucide-react";

interface SiteBrandingProps {
    className?: string;
    priority?: boolean;
}

export async function SiteBranding({ className = "" }: SiteBrandingProps) {
    const dbContent = await getPublishedContent('home');
    const branding = { ...defaultContent.branding, ...dbContent?.branding };

    const logoUrl = branding.logoUrl;
    const logoText = branding.logoText || "Pet Care Connect";
    const height = branding.logoHeight || 40; // Default 40px
    const showText = branding.showLogoText === true; // Default false

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={logoText}
                    style={{ height: `${height}px` }}
                    className="w-auto object-contain transition-all duration-300"
                />
            ) : (
                <div
                    className="bg-primary/10 p-2 rounded-lg flex items-center justify-center"
                    style={{ height: `${height}px`, width: `${height}px` }}
                >
                    <HeartPulse className="w-[60%] h-[60%] text-primary" />
                </div>
            )}

            {showText && (
                <span className="font-bold text-xl tracking-tight text-primary">
                    {logoText}
                </span>
            )}
        </div>
    );
}
