import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroPets from "@/assets/hero-pets.jpg";

const benefits = [
  "Sin tarjeta de crédito",
  "14 días de prueba gratis",
  "Soporte 24/7",
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              <span className="text-sm font-medium text-secondary-foreground">
                +500 clínicas confían en nosotros
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Sistema de Gestión para{" "}
              <span className="text-gradient-primary">Clínicas Veterinarias</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Administra tu clínica veterinaria de forma eficiente. Gestiona pacientes, citas, historial clínico, facturación e inventario en una sola plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="xl">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Ya tengo cuenta
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-3xl" />
              
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/50">
                <img
                  src={heroPets}
                  alt="Mascotas felices en clínica veterinaria"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center">
                      <span className="text-2xl">🐕</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">+10,000 pacientes</p>
                      <p className="text-sm text-muted-foreground">Gestionados este mes</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-card shadow-card border border-border/50 flex items-center justify-center"
              >
                <span className="text-4xl">🐱</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-hero shadow-glow flex items-center justify-center"
              >
                <span className="text-2xl">💊</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
