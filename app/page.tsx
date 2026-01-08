import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  Package,
  CreditCard,
  Syringe,
  MessageSquare,
  Home as HomeIcon,
  Clock,
  ShieldCheck,
  Database,
  CheckCircle2,
  Server,
  Code2,
  Lock,
  Zap,
  Layout,
  Smartphone,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Pet Care Connect</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Características</Link>
            <Link href="#tech" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Tecnología</Link>
            <Link href="#roadmap" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Roadmap</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Precios</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-200">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Listo para Producción: Versión 1.0.0 MTY
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
              El Sistema Operativo Moderno para <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Clínicas Veterinarias</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Una plataforma SaaS integral diseñada para optimizar operaciones, mejorar la atención al paciente y automatizar tareas administrativas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-lg shadow-xl shadow-emerald-200 transition-all hover:scale-105">
                  Ver Demo
                </Button>
              </Link>
              <Link href="https://github.com/wasigonzi/pet-care-connect" target="_blank">
                <Button variant="outline" size="lg" className="h-14 px-10 border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 rounded-full text-lg bg-white">
                  Ver Documentación
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center divide-x divide-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-500 font-medium">Módulos Funcionales</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500 font-medium">Uptime del Sistema</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500 font-medium">Type Safe</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">Next.js 15</div>
                <div className="text-sm text-gray-500 font-medium">Última Tecnología</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Capacidades de la Plataforma</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Todo lo que necesitas para tu práctica</h2>
              <p className="mt-4 text-xl text-gray-600">
                Desde registros de pacientes hasta facturación, inventario y análisis: lo tenemos cubierto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: BarChart3, title: "Dashboard y Analíticas", desc: "Métricas en tiempo real, volumen de citas, seguimiento de ingresos e información operativa.", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Users, title: "Gestión de Clientes y Pacientes", desc: "Perfiles completos, hogares con múltiples mascotas, historial médico y búsqueda avanzada.", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: Calendar, title: "Agenda Inteligente", desc: "Calendario arrastrar y soltar, detección de conflictos, recordatorios automáticos y visitas recurrentes.", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: FileText, title: "Registros Clínicos", desc: "Plantillas SOAP, gestión de recetas, adjuntos digitales y planes de tratamiento.", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Package, title: "Control de Inventario", desc: "Seguimiento de stock, alertas de stock bajo, gestión de proveedores y monitoreo de caducidad.", color: "text-orange-600", bg: "bg-orange-50" },
                { icon: CreditCard, title: "Facturación y Finanzas", desc: "Facturación automatizada, presupuestos, procesamiento de pagos e informes financieros.", color: "text-green-600", bg: "bg-green-50" },
                { icon: Syringe, title: "Vacunación", desc: "Seguimiento de inmunización, recordatorios de vencimiento, gestión de protocolos y cumplimiento.", color: "text-red-600", bg: "bg-red-50" },
                { icon: MessageSquare, title: "Centro de Comunicación", desc: "Integración de Email/SMS, plantillas, registro de llamadas y flujos de trabajo automatizados.", color: "text-teal-600", bg: "bg-teal-50" },
                { icon: HomeIcon, title: "Hospitalización", desc: "Gestión de unidades, reservas, check-in/out y monitoreo médico.", color: "text-pink-600", bg: "bg-pink-50" },
                { icon: Clock, title: "Tiempo y Asistencia", desc: "Entrada/salida del personal, horarios, seguimiento de horas extras e integración de nómina.", color: "text-cyan-600", bg: "bg-cyan-50" },
                { icon: ShieldCheck, title: "Admin y Seguridad", desc: "Acceso basado en roles (RBAC), registros de auditoría, copias de seguridad y configuración de la clínica.", color: "text-slate-600", bg: "bg-slate-50" },
                { icon: CheckCircle2, title: "Gestión de Tareas", desc: "Asignación de tareas al personal, niveles de prioridad, fechas de vencimiento y seguimiento del progreso.", color: "text-yellow-600", bg: "bg-yellow-50" },
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 bg-white rounded-3xl border border-gray-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} transition-transform group-hover:scale-110`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section id="tech" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Bajo el Capó</span>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl mb-6">Arquitectura Técnica Moderna</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Construido con las últimas y más robustas tecnologías para garantizar rendimiento, seguridad y escalabilidad para su negocio.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Code2, title: "Frontend Stack", desc: "Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI" },
                    { icon: Server, title: "Infraestructura Backend", desc: "Supabase (PostgreSQL 15), Edge Functions, Seguridad RLS" },
                    { icon: Database, title: "Gestión de Datos", desc: "Suscripciones en tiempo real, Backups Automatizados, Almacenamiento S3" },
                    { icon: Lock, title: "Seguridad Primero", desc: "Encriptación AES-256, Autorización RBAC, Auditoría" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1 bg-gray-100 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-xs text-slate-400 font-mono">architecture.tsx</div>
                  </div>
                  <code className="text-sm font-mono text-slate-300">
                    <div className="mb-2"><span className="text-purple-400">const</span> <span className="text-blue-400">PetCarePlatform</span> = <span className="text-yellow-300">{"{"}</span></div>
                    <div className="pl-4 mb-1">framework: <span className="text-green-400">&quot;Next.js 16.0.10&quot;</span>,</div>
                    <div className="pl-4 mb-1">uiLib: <span className="text-green-400">&quot;React 19 RC&quot;</span>,</div>
                    <div className="pl-4 mb-1">database: <span className="text-green-400">&quot;Supabase PG15&quot;</span>,</div>
                    <div className="pl-4 mb-1">styling: <span className="text-green-400">&quot;Tailwind CSS 3.4&quot;</span>,</div>
                    <div className="pl-4 mb-1">security: <span className="text-yellow-300">{"["}</span></div>
                    <div className="pl-8 mb-1"><span className="text-green-400">&quot;RLS Policies&quot;</span>,</div>
                    <div className="pl-8 mb-1"><span className="text-green-400">&quot;Encrypted Session&quot;</span></div>
                    <div className="pl-4 mb-1"><span className="text-yellow-300">{"]"}</span>,</div>
                    <div className="pl-4 mb-1">performance: <span className="text-yellow-300">{"{"}</span></div>
                    <div className="pl-8 mb-1">uptime: <span className="text-orange-400">99.9</span>,</div>
                    <div className="pl-8 mb-1">latency: <span className="text-green-400">&quot;&lt;50ms&quot;</span></div>
                    <div className="pl-4 mb-1"><span className="text-yellow-300">{"}"}</span></div>
                    <div><span className="text-yellow-300">{"}"}</span></div>
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design & UX Section */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="mb-16">
              <span className="text-emerald-400 font-bold tracking-wide uppercase text-sm">Experiencia de Usuario</span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Diseñado para personas, no solo datos</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Layout className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Glassmorphism UI</h3>
                <p className="text-slate-400 text-sm">Diseño visual moderno con profundidad y claridad.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Smartphone className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Totalmente Responsivo</h3>
                <p className="text-slate-400 text-sm">Experiencia fluida en Móvil, Tablet y Escritorio.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Zap className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Interacciones Instantáneas</h3>
                <p className="text-slate-400 text-sm">Actualizaciones en tiempo real sin recargas de página.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Globe className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Accesibilidad Primero</h3>
                <p className="text-slate-400 text-sm">Cumple con WCAG 2.1 AA para todos los usuarios.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Estado de Desarrollo</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Roadmap de Implementación</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Nuestro viaje para construir la plataforma veterinaria más completa.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { phase: "Fase 1", title: "Cimientos", status: "Completado", items: ["Autenticación y Seguridad", "Dashboard y Métricas", "DB Clientes/Pacientes", "Reportes Básicos"], color: "emerald" },
                { phase: "Fase 2", title: "Ops Clínicas", status: "Completado", items: ["Registros SOAP", "Gestión de Recetas", "Seguimiento Vacunas", "Sistema Facturación"], color: "emerald" },
                { phase: "Fase 3", title: "Funciones Avanzadas", status: "Completado", items: ["Hospitalización", "Gestión de Tareas", "Control de Tiempo", "Logs de Auditoría"], color: "emerald" },
                { phase: "Fase 4", title: "Mejoras Futuras", status: "Planeado", items: ["Apps Nativas", "Diagnóstico IA", "Telemedicina", "Multi-idioma"], color: "blue" }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-3xl border-2 ${plan.status === 'Completado' ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 bg-white'} `}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.status === 'Completado' ? 'text-emerald-600' : 'text-blue-600'}`}>{plan.phase}</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">{plan.title}</h3>
                  <ul className="space-y-3 mb-6">
                    {plan.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        {plan.status === 'Completado' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300"></div>}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${plan.status === 'Completado' ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {plan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Footer Banner */}
        <section className="py-20 bg-slate-50 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">¿Listo para transformar tu clínica?</h2>
                <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">Únete a las prácticas veterinarias con visión de futuro que están reduciendo costos administrativos en un 25% y aumentando ingresos en un 15% con Pet Care Connect.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-emerald-500/20">
                      Prueba Gratis
                    </Button>
                  </Link>
                  <Link href="#contact">
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full px-10 h-14 text-lg font-bold">
                      Contactar Ventas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white py-12 text-sm text-gray-500 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-gray-900">Pet Care Connect</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-emerald-600 transition-colors">Documentación</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Soporte</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Términos</Link>
          </div>
          <p>© 2024 Pet Care Connect. Licencia MIT.</p>
        </div>
      </footer>
    </div>
  );
}
