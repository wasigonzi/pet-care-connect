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
    LayoutTemplate,
    HeartPulse,
    Home,
    Calculator,
    Truck,
    BarChart3,
    MessageSquare,
    Bell,
    ListTodo,
    Users2,
    Lock,
    Clock,
    FileSearch
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        title: "Principal",
        items: [
            {
                title: "Tablero",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Clientes",
                href: "/dashboard/clients",
                icon: Users,
            },
            {
                title: "Pacientes",
                href: "/dashboard/patients",
                icon: Dog,
            },
            {
                title: "Citas",
                href: "/dashboard/appointments",
                icon: Calendar,
            },
            {
                title: "Historial Clínico",
                href: "/dashboard/records",
                icon: FileText,
            },
            {
                title: "Vacunación",
                href: "/dashboard/vaccinations",
                icon: Syringe,
            },
        ],
    },
    {
        title: "Clínico",
        items: [
            {
                title: "Plantillas",
                href: "/dashboard/templates",
                icon: LayoutTemplate,
            },
            {
                title: "Planes de Bienestar",
                href: "/dashboard/wellness-plans",
                icon: HeartPulse,
            },
            {
                title: "Hospedaje",
                href: "/dashboard/boarding",
                icon: Home,
            },
        ],
    },
    {
        title: "Gestión",
        items: [
            {
                title: "Facturación",
                href: "/dashboard/billing",
                icon: CreditCard,
            },
            {
                title: "Presupuestos",
                href: "/dashboard/estimates",
                icon: Calculator,
            },
            {
                title: "Inventario",
                href: "/dashboard/inventory",
                icon: Package,
            },
            {
                title: "Proveedores",
                href: "/dashboard/suppliers",
                icon: Truck,
            },
            {
                title: "Reportes",
                href: "/dashboard/reports",
                icon: BarChart3,
            },
            {
                title: "Comunicaciones",
                href: "/dashboard/communications",
                icon: MessageSquare,
            },
            {
                title: "Recordatorios",
                href: "/dashboard/reminders",
                icon: Bell,
            },
            {
                title: "Tareas",
                href: "/dashboard/tasks",
                icon: ListTodo,
            },
        ],
    },
    {
        title: "Administración",
        items: [
            {
                title: "Equipo",
                href: "/dashboard/staff",
                icon: Users2,
            },
            {
                title: "Permisos",
                href: "/dashboard/permissions",
                icon: Lock,
            },
            {
                title: "Configuración",
                href: "/dashboard/settings",
                icon: Settings,
            },
            {
                title: "Control Horario",
                href: "/dashboard/time-tracking",
                icon: Clock,
            },
            {
                title: "Auditoría",
                href: "/dashboard/audit",
                icon: FileSearch,
            },
        ],
    },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start gap-6 px-2">
            {navGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                    <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {group.title}
                    </h3>
                    <div className="space-y-1">
                        {group.items.map((item, itemIndex) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={itemIndex}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors",
                                        pathname === item.href
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "text-gray-600"
                                    )}
                                >
                                    <Icon className={cn("mr-3 h-4 w-4", pathname === item.href ? "text-emerald-700" : "text-gray-500 group-hover:text-emerald-600")} />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
