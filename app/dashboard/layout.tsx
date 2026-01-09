import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { SiteBranding } from "@/components/site-branding";
import { getPublishedContent } from "@/app/dashboard/admin/landing/actions";
import { defaultContent } from "@/lib/defaults";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    console.log("🔹 Dashboard Layout Checking Auth...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
        console.error("❌ Dashboard Auth Error:", authError.message);
    }

    if (!user) {
        console.warn("⚠️ No user found in Dashboard Layout, redirecting to /login");
        redirect("/login");
    }

    console.log("✅ Dashboard Layout User found:", user.email);

    // Fetch branding config for dynamic header sizing
    const dbContent = await getPublishedContent('home');
    const branding = { ...defaultContent.branding, ...dbContent?.branding };
    const logoHeight = branding.logoHeight || 40;

    // Calculate header height with padding
    const verticalPadding = 16; // 8px top + 8px bottom
    const minHeaderHeight = logoHeight + verticalPadding;

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <header
                className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm"
                style={{
                    minHeight: `${minHeaderHeight}px`,
                    paddingTop: `${verticalPadding / 2}px`,
                    paddingBottom: `${verticalPadding / 2}px`,
                }}
            >
                <SiteBranding />
                <div className="ml-auto flex items-center gap-4">
                    <UserNav />
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden w-[200px] flex-col border-r bg-muted/40 md:flex">
                    <div className="flex-1 p-4">
                        <SidebarNav />
                    </div>
                </aside>
                <main className="flex w-full flex-col overflow-hidden p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
