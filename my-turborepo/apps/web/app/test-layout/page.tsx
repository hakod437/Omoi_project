"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutContainer } from '../components/layout/layout-container';
import { getClient } from '@/lib/supabase/client';

export default function TestLayoutPage() {
    const supabase = getClient();
    // 1. STATE MANAGEMENT
    const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. THE GATEKEEPER (Validation Logic)
    const validateForm = () => {
        // Email check
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isEmailValid) {
            toast.error("Veuillez entrer un email valide.");
            return false;
        }

        // Password length check
        if (password.length < 8) {
            toast.error("Le mot de passe doit faire au moins 8 caractères.");
            return false;
        }

        // Match check (only for registration)
        if (activeTab === 'inscription' && password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Step 1: Validate
        if (!validateForm()) return;

        // Step 2: Start Loading
        setIsLoading(true);

        try {
            if (activeTab === 'inscription') {
                // REGISTRATION
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;
                toast.success("Succès ! Vérifiez votre boîte mail pour confirmer l'inscription.");
            } else {
                // LOGIN
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                toast.success("Bon retour ! Connexion réussie.");
            }
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de l'authentification.");
        } finally {
            // Step 3: Always stop loading
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <LayoutContainer className="max-w-md">

                {/* TABS CONTAINER */}
                <div className="relative flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-full mb-8 border border-slate-200/50 shadow-sm">
                    <button
                        onClick={() => setActiveTab('inscription')}
                        disabled={isLoading}
                        className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-colors z-10 outline-none disabled:opacity-50 ${activeTab === 'inscription' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Inscription
                        {activeTab === 'inscription' && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('connexion')}
                        disabled={isLoading}
                        className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-colors z-10 outline-none disabled:opacity-50 ${activeTab === 'connexion' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Connexion
                        {activeTab === 'connexion' && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                    </button>
                </div>

                <Card className="overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-center text-2xl font-bold text-slate-800">
                            {activeTab === 'inscription' ? 'Créer un compte' : 'Bon retour !'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                <form className="space-y-5 py-2" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-600">Adresse Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nom@exemple.com"
                                            className="rounded-xl h-11"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Mot de passe</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="rounded-xl h-11"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {activeTab === 'inscription' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-2 overflow-hidden"
                                        >
                                            <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                                            <Input
                                                id="confirm"
                                                type="password"
                                                placeholder="••••••••"
                                                className="rounded-xl h-11"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full rounded-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Chargement...
                                            </span>
                                        ) : (
                                            activeTab === 'inscription' ? "S'inscrire" : "Se connecter"
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <p className="mt-8 text-xs text-center text-slate-400 font-light flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Validation & Feedback activés
                </p>
            </LayoutContainer>
        </main>
    );
}
