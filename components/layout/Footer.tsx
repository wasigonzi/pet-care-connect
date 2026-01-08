import { PawPrint, Mail, Phone, MapPin, Clock } from "lucide-react";

const footerLinks = {
  servicios: [
    { label: "Consulta General", href: "#services" },
    { label: "Vacunación", href: "#services" },
    { label: "Cirugía", href: "#services" },
    { label: "Urgencias 24/7", href: "#services" },
  ],
  informacion: [
    { label: "Nuestro Equipo", href: "#team" },
    { label: "Testimonios", href: "#testimonials" },
    { label: "Contacto", href: "#contact" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VetClinic</span>
            </a>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Tu clínica veterinaria de confianza. Más de 15 años cuidando a las mascotas de nuestra comunidad con dedicación y profesionalismo.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:+5491234567890" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +54 9 1234 567890
              </a>
              <a href="mailto:contacto@vetclinic.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                contacto@vetclinic.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Av. Principal 1234, Buenos Aires
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lun-Sáb: 9:00 - 20:00 | Urgencias 24/7
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Información</h4>
            <ul className="space-y-2">
              {footerLinks.informacion.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 VetClinic. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hecho con ❤️ para tus mascotas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
