import { motion } from "framer-motion";

const team = [
  {
    name: "Dr. Roberto López",
    role: "Director Médico",
    specialty: "Medicina General y Cirugía",
    avatar: "RL",
  },
  {
    name: "Dra. Carolina Méndez",
    role: "Veterinaria Senior",
    specialty: "Dermatología y Alergias",
    avatar: "CM",
  },
  {
    name: "Dr. Alejandro Torres",
    role: "Veterinario",
    specialty: "Traumatología y Ortopedia",
    avatar: "AT",
  },
  {
    name: "Dra. Patricia Ruiz",
    role: "Veterinaria",
    specialty: "Cardiología",
    avatar: "PR",
  },
];

export const Team = () => {
  return (
    <section id="team" className="py-20 md:py-32 bg-muted/30">
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
            Nuestro Equipo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Profesionales dedicados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contamos con un equipo de veterinarios especializados y apasionados por el bienestar animal
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm">
                  {member.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
