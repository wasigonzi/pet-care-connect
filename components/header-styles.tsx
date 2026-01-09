"use client";

interface HeaderStylesProps {
    logoHeight: number;
    minHeaderHeight: number;
    verticalPadding: number;
    mobileMaxLogo: number;
    mobileMinHeight: number;
}

/**
 * Client Component for injecting dynamic CSS variables
 * Separated from DynamicHeader to keep it as a Server Component
 */
export function HeaderStyles({
    logoHeight,
    minHeaderHeight,
    verticalPadding,
    mobileMaxLogo,
    mobileMinHeight
}: HeaderStylesProps) {
    return (
        <style jsx global>{`
            :root {
                --logo-height: ${logoHeight}px;
                --header-min-height: ${minHeaderHeight}px;
                --header-padding-y: ${verticalPadding / 2}px;
                --mobile-logo-height: ${mobileMaxLogo}px;
                --mobile-header-min-height: ${mobileMinHeight}px;
            }
        `}</style>
    );
}
