import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 lg:p-16 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Comienza hoy sin costo
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto">
              ¿Listo para transformar tu clínica veterinaria?
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Únete a más de 500 clínicas que ya confían en VetClinic para gestionar su día a día.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="xl">
                Comenzar Prueba Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10 hover:border-primary-foreground/50"
              >
                Agendar Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
