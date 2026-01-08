import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  FileText,
  Package,
  CreditCard,
  Shield,
  Bell,
  Building2,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Clientes y Pacientes",
    description: "Gestiona fichas de propietarios y mascotas con historial completo",
    color: "from-primary to-primary/70",
  },
  {
    icon: Calendar,
    title: "Agenda de Citas",
    description: "Calendario visual con recordatorios automáticos",
    color: "from-accent to-accent/70",
  },
  {
    icon: FileText,
    title: "Historial Clínico",
    description: "Registros médicos estructurados con plantillas personalizables",
    color: "from-primary to-primary/70",
  },
  {
    icon: Package,
    title: "Inventario",
    description: "Control de stock, medicamentos y alertas de vencimiento",
    color: "from-accent to-accent/70",
  },
  {
    icon: CreditCard,
    title: "Facturación",
    description: "Genera facturas, controla pagos y exporta reportes",
    color: "from-primary to-primary/70",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Datos protegidos con roles y permisos granulares",
    color: "from-accent to-accent/70",
  },
  {
    icon: Bell,
    title: "Recordatorios",
    description: "Notificaciones automáticas de vacunas y citas",
    color: "from-primary to-primary/70",
  },
  {
    icon: Building2,
    title: "Multi-clínica",
    description: "Administra múltiples sucursales desde una cuenta",
    color: "from-accent to-accent/70",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
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
            Características
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Todo lo que necesitas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa diseñada específicamente para clínicas veterinarias
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
