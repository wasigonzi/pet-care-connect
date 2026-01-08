import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Users,
  Calendar,
  Stethoscope,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Dog,
  Cat,
  Activity,
  Syringe,
  Microscope,
  Scissors
} from "lucide-react";
import { getPublishedContent } from "./dashboard/admin/landing/actions";
import { defaultContent } from "@/lib/defaults";

export default async function Home() {
  // Fetch dynamic content
  const dbContent = await getPublishedContent('home');

  // Merge defaults with DB content
  const content = {
    hero: { ...defaultContent.hero, ...dbContent?.hero },
    services: { ...defaultContent.services, ...dbContent?.services },
    contact: { ...defaultContent.contact, ...dbContent?.contact }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">GestionVet</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Servicios</Link>
            <Link href="#team" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Equipo</Link>
            <Link href="#location" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Ubicación</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-violet-50">
                Portal Clientes
              </Button>
            </Link>
            <Link href="/dashboard/appointments/new">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
                Agendar Cita
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-700 text-sm font-medium border border-violet-100 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Abierto Hoy hasta las {content.contact.hours.split("pm")[0]?.split("-")[1] || "8:00 PM"}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 max-w-4xl mx-auto whitespace-pre-line">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard/appointments/new">
                <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-full text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105">
                  {content.hero.cta_primary}
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" size="lg" className="h-14 px-10 border-2 border-gray-200 hover:border-primary hover:text-primary rounded-full text-lg bg-white">
                  {content.hero.cta_secondary}
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center divide-x divide-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-500 font-medium">Años de Historia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5k+</div>
                <div className="text-sm text-gray-500 font-medium">Pacientes Felices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500 font-medium">Atención Urgencias</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">Top</div>
                <div className="text-sm text-gray-500 font-medium">Médicos Certificados</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary font-bold tracking-wide uppercase text-sm">Servicios Integrales</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl">{content.services.title}</h2>
              <p className="mt-4 text-xl text-gray-600">
                {content.services.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Stethoscope, title: "Consulta General", desc: "Evaluaciones completas para diagnóstico y tratamiento oportuno.", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Syringe, title: "Vacunación", desc: "Protocolos de inmunización personalizados para perros y gatos.", color: "text-violet-600", bg: "bg-violet-50" },
                { icon: Microscope, title: "Laboratorio Clínico", desc: "Análisis de sangre, orina y citologías con resultados inmediatos.", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: Activity, title: "Cirugía y Quirófano", desc: "Procedimientos de tejidos blandos y ortopedia con monitoreo avanzado.", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Dog, title: "Hospitalización", desc: "Áreas confortables y separadas para recuperación bajo supervisión médica.", color: "text-orange-600", bg: "bg-orange-50" },
                { icon: Scissors, title: "Estética y Spa", desc: "Baños medicados, corte de pelo y limpieza dental.", color: "text-pink-600", bg: "bg-pink-50" },
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 bg-white rounded-3xl border border-gray-200 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
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

        {/* Why Choose Us */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold tracking-wide uppercase text-sm">Nuestra Diferencia</span>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-5xl mb-6">¿Por qué elegir GestionVet?</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Entendemos que tu mascota es un miembro más de la familia. Por eso nos esforzamos en ofrecer un servicio que combine excelencia médica con verdadera empatía.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Users, title: "Equipo Apasionado", desc: "Veterinarios y auxiliares que aman lo que hacen." },
                    { icon: ShieldCheck, title: "Instalaciones Seguras", desc: "Espacios diseñados para minimizar el estrés de tu mascota." },
                    { icon: Clock, title: "Agenda Flexible", desc: "Citas disponibles fines de semana y sistema de reserva online." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1 bg-violet-50 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-primary" />
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
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 flex items-center justify-center">
                  {/* Placeholder for Clinic Image - Using an Icon for now, assuming no image asset available */}
                  <div className="text-center p-8">
                    <HeartPulse className="w-32 h-32 text-primary/20 mx-auto mb-4" />
                    <p className="text-muted-foreground">Imagen de la Clínica</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/Location Section */}
        <section id="location" className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Visítanos</h2>
                <p className="text-slate-300 mb-8">Estamos convenientemente ubicados en el centro de la ciudad, con estacionamiento exclusivo para clientes.</p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Dirección</h4>
                      <p className="text-slate-400">{content.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Teléfono</h4>
                      <p className="text-slate-400">{content.contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Horario</h4>
                      <p className="text-slate-400">{content.contact.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-80 bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center">
                <p className="text-slate-500">Mapa de Ubicación</p>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Footer Banner */}
        <section className="py-20 bg-slate-50 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-violet-500 rounded-full blur-[100px] opacity-20"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-fuchsia-500 rounded-full blur-[100px] opacity-20"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Tu mascota en las mejores manos</h2>
                <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">Agenda una cita de control hoy mismo y asegura una vida larga y saludable para tu compañero.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard/appointments/new">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-primary/20">
                      {content.hero.cta_primary}
                    </Button>
                  </Link>
                  <Link href="#contact">
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full px-10 h-14 text-lg font-bold">
                      Llamar ahora
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
            <div className="bg-violet-100 p-2 rounded-lg">
              <HeartPulse className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-gray-900">GestionVet</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Aviso de Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors">Términos de Servicio</Link>
          </div>
          <p>© 2024 GestionVet Clínica Veterinaria.</p>
        </div>
      </footer>
    </div>
  );
}
