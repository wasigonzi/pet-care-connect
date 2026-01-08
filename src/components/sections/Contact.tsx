import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    info: "+54 9 1234 567890",
    description: "Llámanos en cualquier momento",
  },
  {
    icon: Mail,
    title: "Email",
    info: "contacto@vetclinic.com",
    description: "Respuesta en 24 horas",
  },
  {
    icon: MapPin,
    title: "Ubicación",
    info: "Av. Principal 1234",
    description: "Buenos Aires, Argentina",
  },
  {
    icon: Clock,
    title: "Horario",
    info: "Lun - Sáb: 9:00 - 20:00",
    description: "Urgencias 24/7",
  },
];

export const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-sm font-medium text-secondary-foreground mb-4">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para atenderte. Agenda tu cita o comunícate con nosotros
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-primary font-medium mb-1">{item.info}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-6 h-48 rounded-2xl bg-muted border border-border/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Av. Principal 1234, Buenos Aires
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              <h3 className="text-xl font-semibold mb-6 text-foreground">
                Envíanos un mensaje
              </h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nombre
                    </label>
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Teléfono
                    </label>
                    <Input placeholder="Tu teléfono" type="tel" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input placeholder="tu@email.com" type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nombre de tu mascota
                  </label>
                  <Input placeholder="Ej: Max" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Mensaje
                  </label>
                  <Textarea
                    placeholder="¿En qué podemos ayudarte?"
                    rows={4}
                  />
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  Enviar Mensaje
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
