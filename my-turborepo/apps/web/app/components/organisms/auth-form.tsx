"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AuthTabs } from "../organisms/auth-tabs";
import { FormField } from "../organisms/form-field";
import { getClient } from '@/lib/supabase/client';

export default function AuthForm() {
    const supabase = getClient();

    // 1. STATE MANAGEMENT
    const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. THE GATEKEEPER (Validation Logic)
    const validateForm = () => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isEmailValid) {
            toast.error("Veuillez entrer un email valide.");
            return false;
        }

        if (password.length < 8) {
            toast.error("Le mot de passe doit faire au moins 8 caractères.");
            return false;
        }

        if (activeTab === 'inscription' && password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (activeTab === 'inscription') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;
                toast.success("Succès ! Vérifiez votre boîte mail.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                toast.success("Bon retour !");
            }
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} isLoading={isLoading} />

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
                                <FormField
                                    label="Adresse Email"
                                    id="email"
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    className="rounded-xl h-11"
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />

                                <FormField
                                    label="Mot de passe"
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-xl h-11"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />

                                {activeTab === 'inscription' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <FormField
                                            label="Confirmer le mot de passe"
                                            id="confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            className="rounded-xl h-11"
                                            value={confirmPassword}
                                            onChange={(e: any) => setConfirmPassword(e.target.value)}
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
        </>
    );
}
