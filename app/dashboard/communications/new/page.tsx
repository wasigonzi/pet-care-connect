import { SendMessageForm } from "../components/send-message-form";

export default function NewCommunicationPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Send Message</h2>
            </div>
            <div className="max-w-2xl">
                <SendMessageForm />
            </div>
        </div>
    );
}
