"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Package,
    CreditCard,
    Syringe,
    Settings,
    Dog,
} from "lucide-react";

const items = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Clients",
        href: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Patients",
        href: "/dashboard/patients",
        icon: Dog,
    },
    {
        title: "Appointments",
        href: "/dashboard/appointments",
        icon: Calendar,
    },
    {
        title: "Medical Records",
        href: "/dashboard/records",
        icon: FileText,
    },
    {
        title: "Vaccinations",
        href: "/dashboard/vaccinations",
        icon: Syringe,
    },
    {
        title: "Inventory",
        href: "/dashboard/inventory",
        icon: Package,
    },
    {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
