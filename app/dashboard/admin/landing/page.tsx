import { getLandingPage } from "./actions";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { CMSEditor } from "./components/cms-editor";

export default async function LandingAdminPage() {
    // Ensure we have the 'home' page data
    const data = await getLandingPage('home');

    if (!data) {
        return <div className="p-8 text-center text-red-500">Error cargando CMS. Verifica la conexión a Supabase.</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Contenido Web</h1>
                <p className="text-gray-500">Administra el contenido de la landing page pública.</p>
            </div>

            <CMSEditor pageId={data.page.id} initialSections={data.sections} />
        </div>
    );
}
