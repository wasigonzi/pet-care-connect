import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, FileText, Users, Shield, Zap } from 'lucide-react'

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

  // Si el usuario está autenticado, mostrar botón para ir a su dashboard
  let userDashboardLink = '/login'
  let isAuthenticated = false

  if (user) {
    isAuthenticated = true
    try {
      // Try safe function first
      const { data: roleResult, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_id: user.id });

      let userRole = 'client'; // default

      if (roleError) {
        console.error("Error with safe function in homepage:", roleError.message);
        // Fallback: try direct profile access
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!profileError && profile) {
            userRole = profile.role;
          }
        } catch (fallbackError) {
          console.error("Fallback role detection failed in homepage:", fallbackError);
          userRole = 'client'; // ultimate fallback
        }
      } else {
        userRole = roleResult || 'client';
      }

      // Set dashboard link based on role
      if (['admin', 'vet', 'assistant', 'receptionist'].includes(userRole)) {
        userDashboardLink = '/dashboard';
      } else {
        userDashboardLink = '/client';
      }
    } catch (error) {
      console.error("Role detection failed in homepage:", error);
      userDashboardLink = '/client'; // safe fallback
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Pet Care Connect</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button asChild>
                  <Link href={userDashboardLink}>Ir al Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/login">Comenzar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Gestión
            <span className="text-blue-600 block">Veterinaria Integral</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Administra tu clínica veterinaria de manera eficiente con nuestro sistema completo 
            para pacientes, citas, historiales médicos, facturación y comunicación con clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link href={userDashboardLink}>Acceder al Sistema</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/login">Comenzar Ahora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Ver Características</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu clínica
            </h3>
            <p className="text-lg text-gray-600">
              Funcionalidades diseñadas específicamente para veterinarios y clínicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>
                  Sistema completo de citas con calendario, recordatorios automáticos y gestión de disponibilidad
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Historiales Médicos</CardTitle>
                <CardDescription>
                  Registros médicos digitales completos, vacunas, tratamientos y seguimiento de pacientes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Portal de Clientes</CardTitle>
                <CardDescription>
                  Los clientes pueden ver el historial de sus mascotas, agendar citas y comunicarse contigo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Seguridad Avanzada</CardTitle>
                <CardDescription>
                  Control de acceso basado en roles, datos encriptados y cumplimiento de normativas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Facturación Integrada</CardTitle>
                <CardDescription>
                  Sistema de facturación completo con seguimiento de pagos y reportes financieros
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Cuidado Integral</CardTitle>
                <CardDescription>
                  Recordatorios de vacunas, planes de bienestar y seguimiento preventivo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para modernizar tu clínica?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de veterinarios que ya confían en Pet Care Connect
          </p>
          {!isAuthenticated && (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Comenzar Gratis</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Heart className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-lg font-semibold">Pet Care Connect</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2026 Pet Care Connect. Sistema de gestión veterinaria integral.
          </p>
        </div>
      </footer>
    </div>
  )
}