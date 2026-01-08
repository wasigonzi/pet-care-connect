import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dra. María García",
    role: "Veterinaria, Clínica Pet Care",
    content:
      "VetClinic ha transformado completamente la gestión de nuestra clínica. La agenda y los recordatorios automáticos nos ahorran horas cada semana.",
    avatar: "MG",
    rating: 5,
  },
  {
    name: "Dr. Carlos Rodríguez",
    role: "Director, Hospital Veterinario Central",
    content:
      "El sistema multi-clínica es excepcional. Ahora administro 3 sucursales desde un solo lugar con visibilidad total del negocio.",
    avatar: "CR",
    rating: 5,
  },
  {
    name: "Dra. Ana Martínez",
    role: "Fundadora, VetLife",
    content:
      "La atención al cliente es increíble. Siempre responden rápido y el sistema nunca nos ha fallado. Totalmente recomendado.",
    avatar: "AM",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
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
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veterinarios de todo el país confían en VetClinic para su práctica diaria
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 md:p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
