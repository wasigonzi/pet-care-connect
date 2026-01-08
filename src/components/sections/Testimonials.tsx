import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "Dueña de Max (Golden Retriever)",
    content:
      "Excelente atención para mi perrito. El Dr. López es muy profesional y cariñoso con los animales. Siempre nos sentimos en buenas manos.",
    avatar: "MG",
    rating: 5,
  },
  {
    name: "Carlos Fernández",
    role: "Dueño de Luna (Gata Persa)",
    content:
      "Llevan años cuidando a mi gatita Luna. El equipo es increíble y las instalaciones son muy modernas. 100% recomendado.",
    avatar: "CF",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Dueña de Rocky (Bulldog Francés)",
    content:
      "Operaron a Rocky de emergencia y lo salvaron. Estaremos eternamente agradecidos. Atención 24/7 de verdad.",
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
            La satisfacción de las familias que confían en nosotros es nuestra mayor recompensa
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
