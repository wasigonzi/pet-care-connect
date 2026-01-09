import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <h2 className="mb-4 text-4xl font-bold">404 - Page Not Found</h2>
            <p className="mb-8 text-muted-foreground">Could not find requested resource</p>
            <Link
                href="/"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
                Return Home
            </Link>
        </div>
    );
}
