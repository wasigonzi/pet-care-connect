import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Pet Care Connect - Sistema de Gestión Veterinaria',
  description: 'Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos, facturación y comunicación con clientes.',
  openGraph: {
    title: 'Pet Care Connect - Sistema de Gestión Veterinaria',
    description: 'Sistema integral de gestión para clínicas veterinarias. Administra pacientes, citas, historiales médicos, facturación y comunicación con clientes.',
    type: 'website',
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Si el usuario está autenticado, redirigir según su rol usando la función segura
    try {
      const { data: roleResult, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_id: user.id });

      if (roleError) {
        console.error("Error fetching user role in homepage:", roleError.message);
        // Fallback seguro
        redirect('/client');
      } else {
        const role = roleResult || 'client';
        if (['admin', 'vet', 'assistant', 'receptionist'].includes(role)) {
          redirect('/dashboard');
        } else {
          redirect('/client');
        }
      }
    } catch (error) {
      console.error("Role detection failed in homepage:", error);
      // Fallback seguro
      redirect('/client');
    }
  }

  // Si no está autenticado, redirigir al login
  redirect('/login')
}