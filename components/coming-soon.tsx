
import { Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-gray-100 p-4 rounded-full mb-6">
                <Construction className="h-12 w-12 text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 max-w-md">
                This module is currently under development. Stay tuned for updates!
            </p>
        </div>
    );
}
