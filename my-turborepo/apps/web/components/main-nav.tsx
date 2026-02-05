"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tv, Users, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ThemeSelector } from "@/app/components/theme-selector";
import { useTheme } from "@/app/components/theme-provider";

export function MainNav() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const routes = [
        {
            href: "/dashboard",
            label: "Mes animes",
            icon: Tv,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/friends",
            label: "Amis",
            icon: Users,
            active: pathname === "/dashboard/friends",
        },
        {
            href: "/dashboard/compare",
            label: "Comparaisons",
            icon: BarChart3,
            active: pathname === "/dashboard/compare",
        },
    ];

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 max-w-6xl mx-auto">
                <div className="mr-8 flex items-center gap-2 font-bold text-xl">
                    <Tv className="size-6 text-primary" />
                    <span>Omoi</span>
                </div>

                <div className="flex items-center space-x-4 lg:space-x-6 mx-6">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                route.active
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <route.icon className="size-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex items-center space-x-4">
                    <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/auth">
                            <LogOut className="size-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
