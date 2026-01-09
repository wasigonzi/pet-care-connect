import { requireClient, getClientRecord } from "@/lib/auth-helpers";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import NewAppointmentForm from "./new-appointment-form";

export default async function NewAppointmentPage() {
    await requireClient();
    const clientRecord = await getClientRecord();
    const supabase = await createClient();

    // Fetch client's pets
    const { data: pets } = await supabase
        .from("patients")
        .select("id, name, species, breed")
        .eq("owner_id", clientRecord?.id)
        .order("name", { ascending: true });

    return <NewAppointmentForm pets={pets || []} />;
}
