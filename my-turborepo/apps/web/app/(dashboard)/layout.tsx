import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <MainNav />
            <main className="flex-1 container max-w-6xl mx-auto py-6 px-4">
                {children}
            </main>
        </div>
    );
}
