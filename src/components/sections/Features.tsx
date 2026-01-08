import { motion } from "framer-motion";
import {
  Stethoscope,
  Syringe,
  Scissors,
  HeartPulse,
  Microscope,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Consulta General",
    description: "Exámenes completos y diagnósticos precisos para tu mascota",
    color: "from-primary to-primary/70",
  },
  {
    icon: Syringe,
    title: "Vacunación",
    description: "Programa completo de vacunas y desparasitación",
    color: "from-accent to-accent/70",
  },
  {
    icon: Scissors,
    title: "Cirugía",
    description: "Procedimientos quirúrgicos con tecnología moderna",
    color: "from-primary to-primary/70",
  },
  {
    icon: HeartPulse,
    title: "Urgencias 24/7",
    description: "Atención de emergencias las 24 horas del día",
    color: "from-accent to-accent/70",
  },
  {
    icon: Microscope,
    title: "Laboratorio",
    description: "Análisis clínicos y resultados rápidos",
    color: "from-primary to-primary/70",
  },
  {
    icon: Clock,
    title: "Hospitalización",
    description: "Cuidado intensivo y monitoreo constante",
    color: "from-accent to-accent/70",
  },
  {
    icon: ShieldCheck,
    title: "Estética",
    description: "Baño, peluquería y cuidado del pelaje",
    color: "from-primary to-primary/70",
  },
  {
    icon: Truck,
    title: "Tienda",
    description: "Alimentos, medicamentos y accesorios",
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
    <section id="services" className="py-20 md:py-32 relative">
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
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Cuidado integral para tu mascota
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos servicios veterinarios completos con profesionales especializados y equipos de última generación
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
