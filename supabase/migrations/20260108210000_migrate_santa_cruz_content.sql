-- =====================================================
-- CONTENT MIGRATION: Clínica Veterinaria Santa Cruz
-- =====================================================
-- Migrates real content from https://clinicaveterinariasantacruz.com/
-- to the landing CMS with modern redesigned structure
-- Date: 2026-01-08

-- Get the home page ID
DO $$
DECLARE
    v_page_id UUID;
BEGIN
    -- Ensure home page exists
    INSERT INTO landing_pages (slug, status)
    VALUES ('home', 'draft')
    ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_page_id;

    -- Delete existing sections for clean migration
    DELETE FROM landing_sections WHERE page_id = v_page_id;

    -- =====================================================
    -- 1. BRANDING
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'branding',
        jsonb_build_object(
            'clinicName', 'Clínica Veterinaria Santa Cruz',
            'logoUrl', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=80&fit=crop',
            'logoHeight', 60,
            'tagline', 'Experiencia y Cariño al Servicio de tus Mascotas'
        ),
        1
    );

    -- =====================================================
    -- 2. HERO SECTION
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'hero',
        jsonb_build_object(
            'headline', 'Experiencia y Cariño al Servicio de tus Mascotas',
            'subheadline', 'En nuestra clínica brindamos atención médica completa, bajo la dirección de la Dra. Patricia Pabón, combinando más de 16 años de experiencia con amor, ética y tecnología moderna.',
            'imageUrl', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&h=600&fit=crop',
            'ctaText', 'Agenda tu Cita',
            'ctaLink', 'http://wa.me/7874666486',
            'secondaryCtaText', 'Llámanos',
            'secondaryCtaLink', 'tel:787-520-6080'
        ),
        2
    );

    -- =====================================================
    -- 3. TRUST BAR / STATS
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'stats',
        jsonb_build_object(
            'items', jsonb_build_array(
                jsonb_build_object(
                    'value', '16+',
                    'label', 'Años de Experiencia',
                    'icon', 'award'
                ),
                jsonb_build_object(
                    'value', '3',
                    'label', 'Licencias Activas (PR, PA, FL)',
                    'icon', 'shield-check'
                ),
                jsonb_build_object(
                    'value', '5',
                    'label', 'Acreditaciones Profesionales',
                    'icon', 'badge-check'
                ),
                jsonb_build_object(
                    'value', '100%',
                    'label', 'Dedicación y Amor',
                    'icon', 'heart'
                )
            )
        ),
        3
    );

    -- =====================================================
    -- 4. SERVICES GRID
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'services',
        jsonb_build_object(
            'title', 'Nuestros Servicios',
            'subtitle', 'Atención veterinaria completa para el bienestar de tu mascota',
            'items', jsonb_build_array(
                jsonb_build_object(
                    'title', 'Medicina General y Preventiva',
                    'description', 'Consultas, vacunación, desparasitación y chequeos de rutina para mantener a tu mascota saludable.',
                    'icon', 'stethoscope',
                    'imageUrl', 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Diagnóstico Avanzado',
                    'description', 'Radiología y laboratorio "in house" para diagnósticos precisos y rápidos.',
                    'icon', 'activity',
                    'imageUrl', 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Cirugías Generales y Preventivas',
                    'description', 'Procedimientos quirúrgicos con tecnología moderna y cuidado post-operatorio.',
                    'icon', 'scissors',
                    'imageUrl', 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Bienestar Integral',
                    'description', 'Terapias holísticas combinando medicina moderna con enfoque en bienestar emocional.',
                    'icon', 'sparkles',
                    'imageUrl', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Grooming y Cuidado Diario',
                    'description', 'Servicios de aseo profesional para mantener a tu mascota limpia y saludable.',
                    'icon', 'sparkle',
                    'imageUrl', 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Farmacia Veterinaria',
                    'description', 'Productos y medicamentos veterinarios de calidad para el tratamiento de tu mascota.',
                    'icon', 'pill',
                    'imageUrl', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Microchip y Certificados',
                    'description', 'Microchip de identificación y tags certificados para viajes internacionales.',
                    'icon', 'qr-code',
                    'imageUrl', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'Cuidado Dental',
                    'description', 'Salud oral completa: limpieza, extracciones y prevención de enfermedades dentales.',
                    'icon', 'smile',
                    'imageUrl', 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=300&fit=crop'
                ),
                jsonb_build_object(
                    'title', 'TeleConsulta',
                    'description', 'Consultas veterinarias por WhatsApp fuera de horas laborables. ¡Escríbenos en confianza!',
                    'icon', 'phone',
                    'imageUrl', 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=300&fit=crop'
                )
            )
        ),
        4
    );

    -- =====================================================
    -- 5. WHY CHOOSE US / FEATURES
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'features',
        jsonb_build_object(
            'title', '¿Por Qué Elegirnos?',
            'subtitle', 'Nos distingue un enfoque holístico, combinando medicina moderna, prevención y bienestar emocional',
            'items', jsonb_build_array(
                jsonb_build_object(
                    'title', '16+ Años de Experiencia',
                    'description', 'La Dra. Patricia Pabón cuenta con más de 16 años dedicados al cuidado de pequeños animales.',
                    'icon', 'award'
                ),
                jsonb_build_object(
                    'title', 'Enfoque Holístico',
                    'description', 'Cuidamos a tu mascota en todos los aspectos: físico, emocional y nutricional.',
                    'icon', 'heart-pulse'
                ),
                jsonb_build_object(
                    'title', 'Tecnología Moderna',
                    'description', 'Equipamiento de diagnóstico avanzado con radiología y laboratorio in-house.',
                    'icon', 'microscope'
                ),
                jsonb_build_object(
                    'title', 'Servicio Drop Off',
                    'description', 'Deja a tu mascota para ser atendida mientras trabajas o realizas gestiones.',
                    'icon', 'clock'
                ),
                jsonb_build_object(
                    'title', 'TeleConsulta 24/7',
                    'description', 'Atención por WhatsApp fuera de horas laborables para emergencias y consultas.',
                    'icon', 'message-circle'
                ),
                jsonb_build_object(
                    'title', 'Acreditaciones Profesionales',
                    'description', 'Acreditada por USDA, DEA, AMSCA, AVMA y la Junta de Médicos Veterinarios de PR.',
                    'icon', 'shield-check'
                )
            )
        ),
        5
    );

    -- =====================================================
    -- 6. ABOUT SECTION (Dra. Pabón)
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'about',
        jsonb_build_object(
            'title', 'Amamos a los Animales tanto como tú',
            'subtitle', 'Conoce a la Dra. Patricia N. Pabón',
            'description', 'En la Clínica Veterinaria Santa Cruz, creemos que cada mascota merece una atención profesional con calor humano. Nuestra clínica está dirigida por la Dra. Patricia N. Pabón, una veterinaria puertorriqueña con más de 16 años de experiencia dedicada al cuidado de pequeños animales, con especial interés en medicina general, nutrición, salud oral y dermatología.',
            'imageUrl', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop',
            'credentials', jsonb_build_array(
                'Doctorado en Medicina Veterinaria - Ross University',
                'Licencias activas en Puerto Rico, Pennsylvania y Florida',
                'Acreditada por USDA, DEA, AMSCA, AVMA',
                'Junta de Médicos Veterinarios de Puerto Rico'
            ),
            'achievements', jsonb_build_array(
                jsonb_build_object(
                    'title', 'Directora del Programa de Tecnología Veterinaria',
                    'description', 'Universidad Ana G. Méndez (UAGM), donde logró la acreditación del primer bachillerato en tecnología veterinaria en Barceloneta',
                    'icon', 'graduation-cap'
                ),
                jsonb_build_object(
                    'title', 'Veterinaria de la Casa de Animales',
                    'description', 'UPR Río Piedras, brindando atención a animales en el campus universitario',
                    'icon', 'building-2'
                ),
                jsonb_build_object(
                    'title', 'Consultora de Telemedicina',
                    'description', 'Telemedicina veterinaria en cinco estados de Estados Unidos, junto a Margot Health',
                    'icon', 'globe'
                ),
                jsonb_build_object(
                    'title', 'Profesora y Directora Académica',
                    'description', 'Formando nuevas generaciones de técnicos veterinarios con excelencia',
                    'icon', 'users'
                )
            )
        ),
        6
    );

    -- =====================================================
    -- 7. PROCESS / HOW IT WORKS
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'process',
        jsonb_build_object(
            'title', 'Cómo Funciona',
            'subtitle', 'Proceso simple para cuidar de tu mascota',
            'steps', jsonb_build_array(
                jsonb_build_object(
                    'number', '1',
                    'title', 'Agenda tu Cita',
                    'description', 'Llámanos al 787-520-6080 o escríbenos por WhatsApp al 787-466-6486',
                    'icon', 'calendar'
                ),
                jsonb_build_object(
                    'number', '2',
                    'title', 'Trae a tu Mascota',
                    'description', 'Visítanos o usa nuestro servicio Drop Off si estás ocupado',
                    'icon', 'car'
                ),
                jsonb_build_object(
                    'number', '3',
                    'title', 'Diagnóstico Profesional',
                    'description', 'Evaluación completa con tecnología moderna y experiencia de 16+ años',
                    'icon', 'stethoscope'
                ),
                jsonb_build_object(
                    'number', '4',
                    'title', 'Tratamiento y Seguimiento',
                    'description', 'Plan personalizado con seguimiento continuo para la salud de tu mascota',
                    'icon', 'heart-pulse'
                )
            )
        ),
        7
    );

    -- =====================================================
    -- 8. SPECIAL PRODUCTS
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'products',
        jsonb_build_object(
            'title', '¡Dale Un "Treat" Saludable A Tu Mascota!',
            'items', jsonb_build_array(
                jsonb_build_object(
                    'name', 'My Sweet Pet Cookies',
                    'description', 'Galletas nutricionales creadas por la Dra. Pabón para perros y gatos. Hechas con ingredientes naturales y formuladas para la salud de tu mascota.',
                    'imageUrl', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
                    'availability', 'Disponibles en Tiendas Locales, en nuestra Clínica y en Walmart',
                    'ctaText', 'Consíguelas Ahora',
                    'ctaLink', 'tel:787-520-6080'
                )
            )
        ),
        8
    );

    -- =====================================================
    -- 9. CTA BAND
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'cta_band',
        jsonb_build_object(
            'title', 'Cuidamos a tus Mascotas',
            'description', 'Por eso te ofrecemos el servicio de Drop Off, donde dejas al paciente para ser atendido en lo que trabajas o realizas gestiones.',
            'ctaText', '¡Llámanos hoy mismo!',
            'ctaLink', 'tel:787-520-6080',
            'backgroundImage', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&h=400&fit=crop'
        ),
        9
    );

    -- =====================================================
    -- 10. CONTACT SECTION
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'contact',
        jsonb_build_object(
            'title', 'Visítanos',
            'subtitle', 'Estamos aquí para ayudarte',
            'address', '#41 Ave. Santa Cruz, Bayamón',
            'landmark', 'A pasos del Hospital Auxilio Mutuo San Pablo',
            'phone1', '787-520-6080',
            'phone2', '787-520-6081',
            'whatsapp', '787-466-6486',
            'email', 'clinicaveterinariasantacruzpr@gmail.com',
            'mapUrl', 'https://maps.app.goo.gl/NbYcU51hn5EmVkes8',
            'hours', jsonb_build_object(
                'weekdays', jsonb_build_object(
                    'days', 'Lunes a Viernes',
                    'hours', '7:30am - 5:00pm'
                ),
                'saturday', jsonb_build_object(
                    'days', 'Sábado',
                    'hours', '8:00am - 1:00pm'
                ),
                'sunday', jsonb_build_object(
                    'days', 'Domingo',
                    'hours', 'Cerrado'
                )
            )
        ),
        10
    );

    -- =====================================================
    -- 11. FOOTER
    -- =====================================================
    INSERT INTO landing_sections (page_id, key, content, "order")
    VALUES (
        v_page_id,
        'footer',
        jsonb_build_object(
            'clinicName', 'Clínica Veterinaria Santa Cruz',
            'address', '#41 Ave. Santa Cruz, Bayamón, PR',
            'phone', '787-520-6080',
            'email', 'clinicaveterinariasantacruzpr@gmail.com',
            'copyright', '© 2026 Clínica Veterinaria Santa Cruz. Todos los derechos reservados.',
            'socialLinks', jsonb_build_array(
                jsonb_build_object(
                    'platform', 'whatsapp',
                    'url', 'http://wa.me/7874666486',
                    'icon', 'message-circle'
                ),
                jsonb_build_object(
                    'platform', 'phone',
                    'url', 'tel:787-520-6080',
                    'icon', 'phone'
                ),
                jsonb_build_object(
                    'platform', 'email',
                    'url', 'mailto:clinicaveterinariasantacruzpr@gmail.com',
                    'icon', 'mail'
                ),
                jsonb_build_object(
                    'platform', 'map',
                    'url', 'https://maps.app.goo.gl/NbYcU51hn5EmVkes8',
                    'icon', 'map-pin'
                )
            ),
            'quickLinks', jsonb_build_array(
                jsonb_build_object('text', 'Servicios', 'href', '#services'),
                jsonb_build_object('text', 'Sobre Nosotros', 'href', '#about'),
                jsonb_build_object('text', 'Contacto', 'href', '#contact'),
                jsonb_build_object('text', 'Portal Clientes', 'href', '/client'),
                jsonb_build_object('text', 'Agendar Cita', 'href', 'http://wa.me/7874666486')
            )
        ),
        11
    );

    RAISE NOTICE '✅ Content migration completed successfully!';
    RAISE NOTICE '📊 Sections created: 11';
    RAISE NOTICE '🎨 Ready for modern redesign';
    RAISE NOTICE '⚠️  Remember to replace placeholder images with real clinic photos';
END $$;
