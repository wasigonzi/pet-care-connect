import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  ShieldCheck,
  BadgeCheck,
  Heart,
  Stethoscope,
  Activity,
  Scissors,
  Sparkles,
  Pill,
  QrCode,
  Smile,
  Phone,
  HeartPulse,
  Microscope,
  Clock,
  MessageCircle,
  Calendar,
  Car,
  GraduationCap,
  Building2,
  Globe,
  Users,
  MapPin,
  Mail,
  ChevronRight
} from "lucide-react";
import { getPublishedContent } from "./dashboard/admin/landing/actions";
import { SiteBranding } from "@/components/site-branding";
import { DynamicHeader } from "@/components/dynamic-header";
import Image from "next/image";

// Icon mapping for dynamic rendering
const iconMap: Record<string, any> = {
  award: Award,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  heart: Heart,
  stethoscope: Stethoscope,
  activity: Activity,
  scissors: Scissors,
  sparkles: Sparkles,
  pill: Pill,
  "qr-code": QrCode,
  smile: Smile,
  phone: Phone,
  "heart-pulse": HeartPulse,
  microscope: Microscope,
  clock: Clock,
  "message-circle": MessageCircle,
  calendar: Calendar,
  car: Car,
  "graduation-cap": GraduationCap,
  "building-2": Building2,
  globe: Globe,
  users: Users,
  "map-pin": MapPin,
  mail: Mail,
  sparkle: Sparkles
};

export default async function Home() {
  // Fetch dynamic content from CMS
  const content = await getPublishedContent('home');

  // Extract sections with fallbacks
  const branding = content?.branding || {};
  const hero = content?.hero || {};
  const stats = content?.stats || { items: [] };
  const services = content?.services || { items: [] };
  const features = content?.features || { items: [] };
  const about = content?.about || {};
  const process = content?.process || { steps: [] };
  const products = content?.products || { items: [] };
  const ctaBand = content?.cta_band || {};
  const contact = content?.contact || {};
  const footer = content?.footer || {};

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - KEEP CTAs UNCHANGED */}
      <DynamicHeader>
        <SiteBranding />

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#services" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Servicios
          </Link>
          <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Sobre Nosotros
          </Link>
          <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* CRITICAL: Keep these CTAs exactly as specified */}
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
      </DynamicHeader>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                  <Heart className="h-4 w-4 fill-current" />
                  {branding.tagline || "Atención Veterinaria Especializada"}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {hero.headline || "Experiencia y Cariño al Servicio de tus Mascotas"}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {hero.subheadline || "Atención veterinaria completa con más de 16 años de experiencia"}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {hero.ctaLink && (
                    <Link href={hero.ctaLink}>
                      <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-full text-lg shadow-xl shadow-primary/25 w-full sm:w-auto">
                        {hero.ctaText || "Agenda tu Cita"}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  {hero.secondaryCtaLink && (
                    <Link href={hero.secondaryCtaLink}>
                      <Button variant="outline" size="lg" className="h-14 px-8 border-2 rounded-full text-lg w-full sm:w-auto">
                        {hero.secondaryCtaText || "Llámanos"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {hero.imageUrl && (
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={hero.imageUrl}
                    alt="Clínica Veterinaria"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust Bar / Stats */}
        {stats.items && stats.items.length > 0 && (
          <section className="py-12 bg-white border-y">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.items.map((stat: any, index: number) => {
                  const Icon = iconMap[stat.icon] || Award;
                  return (
                    <div key={index} className="text-center space-y-2">
                      <Icon className="h-8 w-8 mx-auto text-primary" />
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Services Grid */}
        {services.items && services.items.length > 0 && (
          <section id="services" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {services.title || "Nuestros Servicios"}
                </h2>
                <p className="text-lg text-gray-600">
                  {services.subtitle || "Atención veterinaria completa para el bienestar de tu mascota"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.items.map((service: any, index: number) => {
                  const Icon = iconMap[service.icon] || Stethoscope;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                      <CardContent className="p-6 space-y-4">
                        {service.imageUrl && (
                          <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                            <Image
                              src={service.imageUrl}
                              alt={service.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        {features.items && features.items.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {features.title || "¿Por Qué Elegirnos?"}
                </h2>
                <p className="text-lg text-gray-600">
                  {features.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.items.map((feature: any, index: number) => {
                  const Icon = iconMap[feature.icon] || Heart;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {about.title && (
          <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {about.imageUrl && (
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={about.imageUrl}
                      alt={about.subtitle || "Dra. Patricia Pabón"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {about.title}
                    </h2>
                    {about.subtitle && (
                      <p className="text-xl font-semibold text-primary mb-4">{about.subtitle}</p>
                    )}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {about.description}
                    </p>
                  </div>

                  {about.credentials && about.credentials.length > 0 && (
                    <div className="space-y-2">
                      {about.credentials.map((credential: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{credential}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {about.achievements && about.achievements.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-xl font-bold text-gray-900">Logros Profesionales</h3>
                      {about.achievements.map((achievement: any, index: number) => {
                        const Icon = iconMap[achievement.icon] || Award;
                        return (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Process / How It Works */}
        {process.steps && process.steps.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {process.title || "Cómo Funciona"}
                </h2>
                <p className="text-lg text-gray-600">
                  {process.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {process.steps.map((step: any, index: number) => {
                  const Icon = iconMap[step.icon] || Calendar;
                  return (
                    <div key={index} className="relative text-center">
                      <div className="mb-4">
                        <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {step.number}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Icon className="h-8 w-8 mx-auto text-primary mb-2" />
                        <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                      {index < process.steps.length - 1 && (
                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Special Products */}
        {products.items && products.items.length > 0 && (
          <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {products.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {products.items.map((product: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      {product.imageUrl && (
                        <div className="relative h-64">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-sm text-gray-500">{product.availability}</p>
                        {product.ctaLink && (
                          <Link href={product.ctaLink}>
                            <Button className="w-full">
                              {product.ctaText}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Band */}
        {ctaBand.title && (
          <section className="relative py-20 bg-primary text-white overflow-hidden">
            {ctaBand.backgroundImage && (
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={ctaBand.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="container relative mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {ctaBand.title}
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                {ctaBand.description}
              </p>
              {ctaBand.ctaLink && (
                <Link href={ctaBand.ctaLink}>
                  <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full text-lg">
                    {ctaBand.ctaText}
                  </Button>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {contact.title && (
          <section id="contact" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {contact.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {contact.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                      <p className="text-gray-600">{contact.address}</p>
                      {contact.landmark && (
                        <p className="text-sm text-gray-500 mt-1">{contact.landmark}</p>
                      )}
                      {contact.mapUrl && (
                        <Link href={contact.mapUrl} target="_blank" className="text-primary hover:underline text-sm mt-2 inline-block">
                          Ver en Google Maps →
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Teléfonos</h3>
                      {contact.phone1 && (
                        <Link href={`tel:${contact.phone1}`} className="block text-gray-600 hover:text-primary">
                          {contact.phone1}
                        </Link>
                      )}
                      {contact.phone2 && (
                        <Link href={`tel:${contact.phone2}`} className="block text-gray-600 hover:text-primary">
                          {contact.phone2}
                        </Link>
                      )}
                      {contact.whatsapp && (
                        <Link href={`http://wa.me/${contact.whatsapp}`} className="block text-green-600 hover:text-green-700 mt-1">
                          WhatsApp: {contact.whatsapp}
                        </Link>
                      )}
                    </div>
                  </div>

                  {contact.email && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <Link href={`mailto:${contact.email}`} className="text-gray-600 hover:text-primary">
                          {contact.email}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {contact.hours && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Horario de Atención</h3>
                      <div className="space-y-3">
                        {contact.hours.weekdays && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium text-gray-900">{contact.hours.weekdays.days}</span>
                            <span className="text-gray-600">{contact.hours.weekdays.hours}</span>
                          </div>
                        )}
                        {contact.hours.saturday && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium text-gray-900">{contact.hours.saturday.days}</span>
                            <span className="text-gray-600">{contact.hours.saturday.hours}</span>
                          </div>
                        )}
                        {contact.hours.sunday && (
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-gray-900">{contact.hours.sunday.days}</span>
                            <span className="text-gray-600">{contact.hours.sunday.hours}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{footer.clinicName || branding.clinicName}</h3>
              <p className="text-gray-400 mb-2">{footer.address}</p>
              {footer.phone && (
                <Link href={`tel:${footer.phone}`} className="text-gray-400 hover:text-white block">
                  {footer.phone}
                </Link>
              )}
              {footer.email && (
                <Link href={`mailto:${footer.email}`} className="text-gray-400 hover:text-white block">
                  {footer.email}
                </Link>
              )}
            </div>

            {footer.quickLinks && footer.quickLinks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2">
                  {footer.quickLinks.map((link: any, index: number) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-400 hover:text-white">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {footer.socialLinks && footer.socialLinks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Contáctanos</h4>
                <div className="flex gap-4">
                  {footer.socialLinks.map((social: any, index: number) => {
                    const Icon = iconMap[social.icon] || Phone;
                    return (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 w-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>{footer.copyright || `© ${new Date().getFullYear()} ${branding.clinicName || "Clínica Veterinaria"}. Todos los derechos reservados.`}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
