# CONTENT MIGRATION PLAN
## Clínica Veterinaria Santa Cruz → Pet Care Connect Platform

### SOURCE WEBSITE
https://clinicaveterinariasantacruz.com/

### LEGAL AUTHORIZATION
✅ Same owner - Authorized to copy all content and images

---

## 📋 CONTENT MAPPING TABLE

### 1. BRAND & IDENTITY
| Source Content | CMS Field | Section Key |
|----------------|-----------|-------------|
| "Clínica Veterinaria Santa Cruz" | `branding.clinicName` | `branding` |
| Logo (to extract) | `branding.logoUrl` | `branding` |
| Tagline: "Experiencia y Cariño al Servicio de tus Mascotas" | `hero.headline` | `hero` |

### 2. HERO SECTION
| Source Content | CMS Field | Section Key |
|----------------|-----------|-------------|
| "Experiencia y Cariño al Servicio de tus Mascotas" | `hero.headline` | `hero` |
| "En nuestra clínica brindamos atención médica completa, bajo la dirección de la Dra. Patricia Pabón, combinando más de 16 años de experiencia con amor, ética y tecnología moderna." | `hero.subheadline` | `hero` |
| Hero image (to extract) | `hero.imageUrl` | `hero` |
| "Agenda tu cita" → WhatsApp link | `hero.ctaText` + `hero.ctaLink` | `hero` |

### 3. TRUST BADGES / STATS
| Source Content | CMS Field | Section Key |
|----------------|-----------|-------------|
| "16+ años de experiencia" | `stats[0]` | `stats` |
| "Licencias en PR, PA, FL" | `stats[1]` | `stats` |
| "Acreditaciones: USDA, DEA, AMSCA, AVMA" | `stats[2]` | `stats` |

### 4. ABOUT SECTION
| Source Content | CMS Field | Section Key |
|----------------|-----------|-------------|
| "Amamos a los Animales tanto como tú" | `about.title` | `about` |
| Full about text (Dra. Pabón bio) | `about.description` | `about` |
| Dra. Pabón image (to extract) | `about.imageUrl` | `about` |
| Professional achievements list | `about.achievements[]` | `about` |

### 5. SERVICES
| Source Service | CMS Field | Section Key |
|----------------|-----------|-------------|
| "Medicina General y Preventiva" | `services[0].title` | `services` |
| "Diagnóstico Avanzado, Radiología y Laboratorio" | `services[1].title` | `services` |
| "Cirugías Generales y Preventivas" | `services[2].title` | `services` |
| "Bienestar Integral y Terapias Holísticas" | `services[3].title` | `services` |
| "Grooming y Cuidado Diario" | `services[4].title` | `services` |
| "Farmacia y Productos Veterinarios" | `services[5].title` | `services` |
| "Microchip y Tags Certificados de Viaje" | `services[6].title` | `services` |
| "Cuidado Dental Veterinario" | `services[7].title` | `services` |
| "TeleConsulta" | `services[8].title` | `services` |

### 6. WHY CHOOSE US (Derived from content)
| Differentiator | Source | CMS Field |
|----------------|--------|-----------|
| "16+ años de experiencia" | About section | `features[0]` |
| "Enfoque holístico" | About section | `features[1]` |
| "Tecnología moderna" | Hero | `features[2]` |
| "Drop Off Service" | Services section | `features[3]` |
| "TeleConsulta WhatsApp" | Top banner | `features[4]` |
| "Acreditaciones profesionales" | About section | `features[5]` |

### 7. PROCESS / HOW IT WORKS
| Step | Content | CMS Field |
|------|---------|-----------|
| 1 | "Agenda tu cita por WhatsApp o teléfono" | `process[0]` |
| 2 | "Trae a tu mascota o usa Drop Off" | `process[1]` |
| 3 | "Diagnóstico profesional con tecnología moderna" | `process[2]` |
| 4 | "Tratamiento personalizado y seguimiento" | `process[3]` |

### 8. SPECIAL PRODUCTS
| Product | Content | CMS Field |
|---------|---------|-----------|
| "My Sweet Pet Cookies" | "Galletas nutricionales creadas por la Dra. Pabón" | `products[0]` |
| Available at | "Tiendas Locales, Clínica, Walmart" | `products[0].availability` |

### 9. CONTACT INFORMATION
| Type | Value | CMS Field |
|------|-------|-----------|
| Phone 1 | 787-520-6080 | `contact.phone1` |
| Phone 2 | 787-520-6081 | `contact.phone2` |
| WhatsApp | 787-466-6486 | `contact.whatsapp` |
| Email | clinicaveterinariasantacruzpr@gmail.com | `contact.email` |
| Address | #41 Ave. Santa Cruz, Bayamón | `contact.address` |
| Landmark | "A pasos del Hospital Auxilio Mutuo San Pablo" | `contact.landmark` |
| Map Link | https://maps.app.goo.gl/NbYcU51hn5EmVkes8 | `contact.mapUrl` |

### 10. HOURS
| Day | Hours | CMS Field |
|-----|-------|-----------|
| Lunes - Viernes | 7:30am - 5:00pm | `contact.hours.weekdays` |
| Sábado | 8:00am - 1:00pm | `contact.hours.saturday` |
| Domingo | Cerrado | `contact.hours.sunday` |

### 11. FOOTER
| Content | CMS Field |
|---------|-----------|
| Clinic name + address | `footer.clinicInfo` |
| Social links (to extract) | `footer.socialLinks[]` |
| Copyright | `footer.copyright` |

---

## 🖼️ IMAGES TO EXTRACT & UPLOAD

### Priority Images
1. **Logo** → `landing-assets/logo.png`
2. **Hero Image** → `landing-assets/hero-main.jpg`
3. **Dra. Pabón Photo** → `landing-assets/dra-pabon.jpg`
4. **Clinic Exterior** → `landing-assets/clinic-exterior.jpg`
5. **Service Icons/Images** (9 images) → `landing-assets/services/`
6. **My Sweet Pet Cookies** → `landing-assets/products/cookies.jpg`

### Fallback Strategy
If images cannot be extracted:
- Use placeholder images from Unsplash (veterinary themed)
- Store URLs in CMS for easy replacement later

---

## 🏗️ NEW LANDING STRUCTURE

### Section Order (Redesigned)
1. **Hero** - Full-width with image, headline, CTA
2. **Trust Bar** - Stats/badges (16+ años, licencias, acreditaciones)
3. **Services Grid** - 3x3 cards with icons
4. **Why Choose Us** - 6 feature cards
5. **About Dra. Pabón** - Image + bio + achievements
6. **How It Works** - 4-step process
7. **Special Products** - My Sweet Pet Cookies showcase
8. **CTA Band** - "Cuidamos a tus Mascotas" with Drop Off info
9. **Contact Section** - Hours, phones, map
10. **Footer** - Full info + social links

---

## 🎨 DESIGN SPECIFICATIONS

### Typography
- Headlines: `font-bold text-4xl md:text-5xl`
- Subheadlines: `text-xl md:text-2xl text-muted-foreground`
- Body: `text-base md:text-lg leading-relaxed`

### Colors (Veterinary Theme)
- Primary: Blue-600 (trust, professionalism)
- Secondary: Green-500 (health, nature)
- Accent: Amber-500 (warmth, care)
- Neutral: Gray-50 to Gray-900

### Spacing
- Section padding: `py-16 md:py-24`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid gaps: `gap-6 md:gap-8`

### Components
- Cards: `rounded-xl shadow-lg hover:shadow-xl transition-shadow`
- Buttons: `rounded-lg px-6 py-3 font-semibold`
- Icons: Lucide React (Heart, Stethoscope, Shield, etc.)

---

## ✅ QUALITY CHECKLIST

### Content
- [ ] All text migrated from source
- [ ] No hardcoded content
- [ ] All images uploaded to Supabase Storage
- [ ] CMS populated with real data
- [ ] Draft/Published workflow works

### Design
- [ ] Modern, clean layout
- [ ] Responsive on mobile/tablet/desktop
- [ ] Clear visual hierarchy
- [ ] Strategic CTA placement
- [ ] Header CTAs unchanged ("Portal Clientes", "Agendar Cita")

### Technical
- [ ] TypeScript compiles cleanly
- [ ] No hydration errors
- [ ] No 404/500 errors
- [ ] RLS policies working
- [ ] No localStorage usage

### Testing
- [ ] Playwright smoke test passes
- [ ] Hero renders correctly
- [ ] Services grid displays
- [ ] Contact info shows
- [ ] Header CTAs present and functional

---

## 📦 DELIVERABLES

1. ✅ This mapping document
2. ⏳ Migration SQL script with real content
3. ⏳ Updated landing page component
4. ⏳ Image upload script/instructions
5. ⏳ Playwright smoke test
6. ⏳ Files changed summary

---

**Status:** Ready to implement  
**Next Step:** Extract images and create migration script
