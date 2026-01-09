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
    // Si el usuario está autenticado, redirigir según su rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'client') {
      redirect('/client')
    } else {
      redirect('/dashboard')
    }
  }

  // Si no está autenticado, redirigir al login
  redirect('/login')
}