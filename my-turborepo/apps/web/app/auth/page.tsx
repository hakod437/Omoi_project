"use client";

import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Eye, EyeOff, Lock, LogIn, Mail, Tv, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { LayoutContainer } from "../components/layout/layout-container";
import AuthForm from "../components/organisms/auth-form";

export default function AuthPage() {
    const { setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    // Force the theme to "abyss" on mount for this specific page
    useEffect(() => {
        setTheme("abyss");
        document.documentElement.setAttribute("data-theme", "abyss");
    }, [setTheme]);
    return (
        <main className="min-h-screen py-12">
            <LayoutContainer className="max-w-md">
                <AuthForm />

                <p className="mt-8 text-xs text-center text-slate-400 font-light flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Atomic Design Refactor Complete
                </p>
            </LayoutContainer>
        </main>
    );
}
