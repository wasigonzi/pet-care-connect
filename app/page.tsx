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
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Features</Link>
            <Link href="#tech" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Tech Stack</Link>
            <Link href="#roadmap" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Roadmap</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                Log In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-200">
                Get Started
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
              Production Ready: Version 1.0.0 Live
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
              The Modern OS for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Veterinary Clinics</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              A comprehensive, single-tenant SaaS platform designed to streamline operations, enhance patient care, and automate administrative tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-lg shadow-xl shadow-emerald-200 transition-all hover:scale-105">
                  Launch Demo
                </Button>
              </Link>
              <Link href="https://github.com/wasigonzi/pet-care-connect" target="_blank">
                <Button variant="outline" size="lg" className="h-14 px-10 border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 rounded-full text-lg bg-white">
                  View Documentation
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center divide-x divide-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-500 font-medium">Functional Modules</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500 font-medium">System Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500 font-medium">Type Safe</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">Next.js 15</div>
                <div className="text-sm text-gray-500 font-medium">Latest Tech</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Platform Capabilities</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">Everything you need to run your practice</h2>
              <p className="mt-4 text-xl text-gray-600">
                From patient records to billing, inventory, and analytics - we&apos;ve got it covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: BarChart3, title: "Dashboard & Analytics", desc: "Real-time metrics, appointment volume, revenue tracking, and operational insights.", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Users, title: "Client & Patient Mgmt", desc: "Comprehensive profiles, multi-pet households, medical history, and advanced search.", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: Calendar, title: "Smart Scheduling", desc: "Drag-and-drop calendar, conflict detection, automated reminders, and recurring visits.", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: FileText, title: "Clinical Records", desc: "SOAP templates, prescription management, digital attachments, and treatment plans.", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Package, title: "Inventory Control", desc: "Stock tracking, low stock alerts, supplier management, and expiration monitoring.", color: "text-orange-600", bg: "bg-orange-50" },
                { icon: CreditCard, title: "Billing & Finance", desc: "Automated invoicing, estimates, payment processing, and financial reporting.", color: "text-green-600", bg: "bg-green-50" },
                { icon: Syringe, title: "Vaccinations", desc: "Immunization tracking, due date reminders, protocol management, and compliance.", color: "text-red-600", bg: "bg-red-50" },
                { icon: MessageSquare, title: "Communication Center", desc: "Email/SMS integration, templates, call logging, and automated workflows.", color: "text-teal-600", bg: "bg-teal-50" },
                { icon: HomeIcon, title: "Boarding & Hospital", desc: "Unit management, reservations, check-in/out, and medical monitoring.", color: "text-pink-600", bg: "bg-pink-50" },
                { icon: Clock, title: "Time & Attendance", desc: "Staff clock-in/out, scheduling, overtime tracking, and payroll integration.", color: "text-cyan-600", bg: "bg-cyan-50" },
                { icon: ShieldCheck, title: "Admin & Security", desc: "Role-based access (RBAC), audit logging, backups, and clinic configuration.", color: "text-slate-600", bg: "bg-slate-50" },
                { icon: CheckCircle2, title: "Task Management", desc: "Staff task assignment, priority levels, due dates, and progress tracking.", color: "text-yellow-600", bg: "bg-yellow-50" },
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
                <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Under the Hood</span>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl mb-6">Modern Technical Architecture</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Built with the latest, most robust technologies to ensure performance, security, and scalability for your business.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Code2, title: "Frontend Stack", desc: "Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI" },
                    { icon: Server, title: "Backend Infrastructure", desc: "Supabase (PostgreSQL 15), Edge Functions, RLS Security" },
                    { icon: Database, title: "Data Management", desc: "Real-time subscriptions, Automated Backups, S3 Storage" },
                    { icon: Lock, title: "Security First", desc: "AES-256 Encryption, RBAC Authorization, Audit Trails" }
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
              <span className="text-emerald-400 font-bold tracking-wide uppercase text-sm">User Experience</span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Designed for people, not just data</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Layout className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Glassmorphism UI</h3>
                <p className="text-slate-400 text-sm">Modern visual design with depth and clarity.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Smartphone className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Fully Responsive</h3>
                <p className="text-slate-400 text-sm">Seamless experience on Mobile, Tablet, and Desktop.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Zap className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Instant Interactions</h3>
                <p className="text-slate-400 text-sm">Real-time updates without page reloads.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <Globe className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Accessibility First</h3>
                <p className="text-slate-400 text-sm">WCAG 2.1 AA compliant for all users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Development Status</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Implementation Roadmap</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Our journey to building the most complete veterinary platform.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { phase: "Phase 1", title: "Core Foundation", status: "Completed", items: ["User Auth & Security", "Dashboard & Metrics", "Client/Patient DB", "Basic Reporting"], color: "emerald" },
                { phase: "Phase 2", title: "Clinical Ops", status: "Completed", items: ["SOAP Records", "Prescription Mgmt", "Vaccination Tracking", "Billing System"], color: "emerald" },
                { phase: "Phase 3", title: "Advanced Features", status: "Completed", items: ["Boarding & Hospital", "Task Management", "Time Tracking", "Audit Logging"], color: "emerald" },
                { phase: "Phase 4", title: "Future Enhancements", status: "Planned", items: ["Mobile Native Apps", "AI Diagnostics", "Telemedicine", "Multi-language"], color: "blue" }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-3xl border-2 ${plan.status === 'Completed' ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 bg-white'} `}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.status === 'Completed' ? 'text-emerald-600' : 'text-blue-600'}`}>{plan.phase}</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">{plan.title}</h3>
                  <ul className="space-y-3 mb-6">
                    {plan.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        {plan.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300"></div>}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${plan.status === 'Completed' ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
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
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to transform your clinic?</h2>
                <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">Join forward-thinking veterinary practices that are reducing admin costs by 25% and increasing revenue by 15% with Pet Care Connect.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-emerald-500/20">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="#contact">
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full px-10 h-14 text-lg font-bold">
                      Contact Sales
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
            <Link href="#" className="hover:text-emerald-600 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Support</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
          </div>
          <p>© 2024 Pet Care Connect. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
