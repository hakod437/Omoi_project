"use client";

import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Eye, EyeOff, Lock, LogIn, Mail, Tv, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthPage() {
    const { setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    // Force the theme to "jade" (Option 1) on mount as requested
    useEffect(() => {
        console.log("🔄 Tentative de forçage du thème JADE sur la page Auth...");

        // 1. On met à jour l'état global pour que les composants React soient au courant
        setTheme("jade");

        // 2. On force l'attribut sur le DOM au cas où le Provider est trop lent
        document.documentElement.setAttribute("data-theme", "jade");

        console.log("✅ Thème JADE injecté dans le DOM.");
    }, [setTheme]);
    return (
        <div className="min-h-screen grid place-items-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-muted">
                        <Tv className="size-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-title text-foreground flex items-center justify-center gap-2">
                            Anime Tracker <span className="text-primary">✨</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Suivez vos animes et partagez avec vos amis
                        </p>
                    </div>
                </div>

                {/* Card */}
                <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <Tabs
                        value={mode}
                        onValueChange={(v) => setMode(v as "login" | "register")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 h-auto">
                            <TabsTrigger
                                value="login"
                                className="py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                <LogIn className="size-4 mr-2" />
                                Connexion
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                <UserPlus className="size-4 mr-2" />
                                Inscription
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nom d'utilisateur
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="otaku_master"
                                        className="pl-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30 h-10 transition-all hover:bg-muted/50"
                                    />
                                </div>
                            </div>

                            {mode === "register" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="votre@email.com"
                                            type="email"
                                            className="pl-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30 h-10 transition-all hover:bg-muted/50"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-9 pr-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/30 h-10 transition-all hover:bg-muted/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {mode === "register" && (
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Minimum 6 caractères
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] font-medium text-base mt-2"
                            >
                                {mode === "login" ? (
                                    <>
                                        <LogIn className="size-4 mr-2" />
                                        Se connecter
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="size-4 mr-2" />
                                        Créer mon compte
                                    </>
                                )}
                            </Button>
                        </div>
                    </Tabs>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground/60">
                    Les données sont stockées localement dans votre navigateur
                </p>
            </div>
        </div>
    );
}
