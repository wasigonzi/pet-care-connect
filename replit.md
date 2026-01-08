# VetConnect - Veterinary Practice Management System

## Overview
A full-stack veterinary clinic management application built with Next.js 16, React 19, TypeScript, and Supabase. Features include client/patient management, appointments, clinical records, billing, inventory, vaccinations, boarding, communications, and staff time tracking.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16.1.1 (App Router with Turbopack)
- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts

### Directory Structure
```
app/                    # Next.js App Router pages
  dashboard/            # Protected dashboard routes
    admin/              # Admin functionality
    appointments/       # Appointment scheduling
    billing/            # Invoice and billing
    boarding/           # Pet boarding reservations
    clients/            # Client management
    communications/     # Email/SMS messaging
    inventory/          # Stock management
    patients/           # Patient (pet) management
    records/            # Clinical records (SOAP notes)
    tasks/              # Task management
    vaccinations/       # Vaccination tracking
  login/                # Authentication pages
components/             # Reusable React components
  auth/                 # Authentication components
  dashboard/            # Dashboard-specific components
  layout/               # Layout components (Navbar, Footer)
  sections/             # Landing page sections
  ui/                   # shadcn/ui components
hooks/                  # Custom React hooks
lib/                    # Utilities and Supabase clients
  supabase/             # Supabase client configuration
supabase/               # Database migrations
  migrations/           # SQL migration files
```

## Environment Setup

### Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Running the Application
The development server runs on port 5000:
```bash
npm run dev -- -p 5000 -H 0.0.0.0
```

## Recent Changes
- 2026-01-08: Initial Replit setup
  - Configured Next.js for Replit environment (allowedDevOrigins)
  - Set up development workflow on port 5000
  - Added placeholder Supabase environment variables

## User Preferences
(None recorded yet)

## Notes
- The middleware.ts file uses Supabase for session management
- Database schema is defined in supabase/migrations/
- UI components use shadcn/ui with Radix primitives
