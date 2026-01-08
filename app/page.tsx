import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, FileText, Activity } from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-6 h-16 flex items-center border-b">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Activity className="h-6 w-6 text-primary" />
                    <span>Pet Care Connect</span>
                </div>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        About
                    </Link>
                </nav>
                <div className="ml-4">
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Modern Veterinary Management
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Streamline your clinic operations with our comprehensive platform. Manage patients, appointments, billing, and inventory in one place.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/dashboard">
                                    <Button size="lg" className="h-11 px-8">
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#">
                                    <Button variant="outline" size="lg" className="h-11 px-8">
                                        Learn more
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-full">
                                    <Calendar className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Smart Scheduling</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Effortlessly manage appointments, block lists, and staff shifts with our intuitive calendar.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-full">
                                    <Users className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Client & Patient Profiles</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Keep detailed records of medical history, vaccinations, and communications for every pet.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-full">
                                    <FileText className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Billing & Invoicing</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Generate invoices, track payments, and manage inventory with integrated financial tools.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Pet Care Connect. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
