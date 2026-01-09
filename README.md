# Pet Care Connect - Sistema de Gestión Veterinaria

## Acerca del Proyecto

**Pet Care Connect** es un sistema integral de gestión para clínicas veterinarias que permite administrar pacientes, citas, historiales médicos, facturación y comunicación con clientes de manera eficiente y segura.

## Características Principales

### 🏥 Gestión Clínica Completa
- **Gestión de Pacientes**: Registro completo de mascotas con historial médico
- **Citas y Agenda**: Sistema de programación de citas con recordatorios automáticos
- **Historiales Médicos**: Registro detallado de consultas, tratamientos y vacunas
- **Inventario**: Control de medicamentos y suministros veterinarios

### 👥 Portal para Clientes
- **Acceso Seguro**: Portal dedicado para que los clientes vean información de sus mascotas
- **Citas Online**: Solicitud y gestión de citas desde el portal del cliente
- **Historial Médico**: Acceso a vacunas, tratamientos y recomendaciones
- **Comunicación Directa**: Mensajería segura con el equipo veterinario

### 💼 Administración y Facturación
- **Facturación Integrada**: Generación automática de facturas y presupuestos
- **Reportes**: Análisis de rendimiento y estadísticas de la clínica
- **Gestión de Personal**: Control de roles y permisos del equipo
- **Recordatorios**: Sistema automatizado de recordatorios de vacunas y revisiones

## Tecnologías Utilizadas

Este proyecto está construido con tecnologías modernas y confiables:

- **Next.js 15** - Framework de React para aplicaciones web
- **TypeScript** - Tipado estático para mayor seguridad
- **Supabase** - Base de datos PostgreSQL con autenticación
- **Tailwind CSS** - Framework de CSS para diseño responsivo
- **shadcn/ui** - Componentes de UI modernos y accesibles
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

## Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+ y npm instalado - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Cuenta de Supabase para la base de datos

### Pasos de Instalación

```sh
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd pet-care-connect

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 5. Aplicar migraciones de base de datos
# Ir a Supabase Dashboard > SQL Editor y ejecutar las migraciones en /supabase/migrations/

# 6. Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```sh
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Verificar código con ESLint
npm run audit:supabase # Auditar configuración de Supabase
```

## Configuración de Base de Datos

El sistema utiliza Supabase como backend. Para configurar:

1. Crear proyecto en [Supabase](https://supabase.com)
2. Obtener URL y claves API del dashboard
3. Configurar variables de entorno en `.env.local`
4. Ejecutar migraciones desde el SQL Editor de Supabase

## Seguridad y Privacidad

- **Autenticación Segura**: Sistema de roles (Admin, Veterinario, Asistente, Cliente)
- **Protección de Datos**: Políticas RLS (Row Level Security) en base de datos
- **Encriptación**: Todas las comunicaciones están encriptadas
- **Cumplimiento**: Diseñado siguiendo mejores prácticas de privacidad médica

## Soporte y Documentación

Para soporte técnico o consultas sobre el sistema:
- Revisar la documentación en `/docs`
- Consultar los tests en `/tests` para ejemplos de uso
- Verificar el estado del sistema en `/dashboard/admin/diagnostics`

## Licencia

Este proyecto está desarrollado para uso en clínicas veterinarias. Todos los derechos reservados.
