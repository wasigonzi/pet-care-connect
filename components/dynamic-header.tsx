import { getPublishedContent } from "@/app/dashboard/admin/landing/actions";
import { defaultContent } from "@/lib/defaults";
import { HeaderStyles } from "./header-styles";

interface DynamicHeaderProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Dynamic Header Component (Server Component)
 * Automatically adjusts height based on logo size from Supabase
 * Ensures logo never overflows or gets clipped
 */
export async function DynamicHeader({ children, className = "" }: DynamicHeaderProps) {
    // Fetch branding config from Supabase
    const dbContent = await getPublishedContent('home');
    const branding = { ...defaultContent.branding, ...dbContent?.branding };

    // Get logo height (default 40px)
    const logoHeight = branding.logoHeight || 40;

    // Calculate header height with padding
    // Formula: logoHeight + vertical padding (16px top + 16px bottom = 32px)
    const verticalPadding = 32;
    const minHeaderHeight = logoHeight + verticalPadding;

    // Responsive adjustments
    // On mobile, ensure minimum usable height but allow logo to scale down if needed
    const mobileMaxLogo = Math.min(logoHeight, 48); // Cap at 48px on mobile
    const mobileMinHeight = mobileMaxLogo + verticalPadding;

    return (
        <>
            {/* Inject CSS variables via Client Component */}
            <HeaderStyles
                logoHeight={logoHeight}
                minHeaderHeight={minHeaderHeight}
                verticalPadding={verticalPadding}
                mobileMaxLogo={mobileMaxLogo}
                mobileMinHeight={mobileMinHeight}
            />

            <header
                className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 ${className}`}
                style={{
                    minHeight: `${minHeaderHeight}px`,
                }}
            >
                <div
                    className="container mx-auto px-4 md:px-6 flex items-center justify-between"
                    style={{
                        minHeight: `${minHeaderHeight}px`,
                        paddingTop: `${verticalPadding / 2}px`,
                        paddingBottom: `${verticalPadding / 2}px`,
                    }}
                >
                    {children}
                </div>
            </header>
        </>
    );
}
