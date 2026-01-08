import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "29",
    description: "Ideal para clínicas pequeñas",
    features: [
      "Hasta 500 pacientes",
      "1 usuario",
      "Agenda de citas",
      "Historial clínico básico",
      "Soporte por email",
    ],
    popular: false,
    cta: "Comenzar Gratis",
  },
  {
    name: "Profesional",
    price: "79",
    description: "Para clínicas en crecimiento",
    features: [
      "Pacientes ilimitados",
      "Hasta 5 usuarios",
      "Todo lo del plan Básico",
      "Facturación y reportes",
      "Control de inventario",
      "Recordatorios automáticos",
      "Soporte prioritario",
    ],
    popular: true,
    cta: "Comenzar Gratis",
  },
  {
    name: "Empresarial",
    price: "149",
    description: "Para hospitales y multi-clínicas",
    features: [
      "Todo lo del plan Profesional",
      "Usuarios ilimitados",
      "Multi-clínica",
      "API personalizada",
      "Integraciones avanzadas",
      "Gestor de cuenta dedicado",
      "SLA 99.9%",
    ],
    popular: false,
    cta: "Contactar Ventas",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-accent/5 to-transparent rounded-full blur-3xl" />
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
            Precios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Planes que se adaptan a ti
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para tu clínica. Todos incluyen 14 días de prueba gratis.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-warm text-primary-foreground text-sm font-medium shadow-soft">
                    <Sparkles className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}
              <div
                className={`h-full p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-card border-primary shadow-glow"
                    : "bg-card/80 border-border/50 shadow-soft hover:shadow-card"
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl md:text-5xl font-extrabold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
