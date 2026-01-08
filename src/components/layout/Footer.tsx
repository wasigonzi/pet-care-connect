import { PawPrint, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  producto: [
    { label: "Características", href: "#features" },
    { label: "Precios", href: "#pricing" },
    { label: "Integraciones", href: "#" },
    { label: "Actualizaciones", href: "#" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreras", href: "#" },
    { label: "Contacto", href: "#" },
  ],
  legal: [
    { label: "Términos de Servicio", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Política de Cookies", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VetClinic</span>
            </a>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              La plataforma líder de gestión para clínicas veterinarias en Latinoamérica.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto:hola@vetclinic.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                hola@vetclinic.com
              </a>
              <a href="tel:+5491234567890" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +54 9 1234 567890
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Producto</h4>
            <ul className="space-y-2">
              {footerLinks.producto.map((link) => (
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

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
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

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
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
              Hecho con ❤️ para veterinarios
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
