"use client";

/**
 * ORGANISM: AuthForm
 * 
 * Role: Orchestrates the entire authentication experience.
 * Why an Organism? 
 * - It contains "Business Logic" (handleSubmit, validaiton).
 * - It manages complex state (Auth mode, loading, form values).
 * - It assembles several molecules (AuthTabs, FormFields).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AuthTabs } from "../molecules/auth-tabs";
import { FormField } from "../molecules/form-field";

export default function AuthForm() {
    // 1. STATE MANAGEMENT
    // We consolidate state here to keep molecules pure and reusable.
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. THE GATEKEEPER (Validation Logic)
    // Professional sanity checks before hitting any API.
    const validateForm = () => {
        const isPhoneValid = /^\d{10,15}$/.test(phoneNumber.replace(/\s/g, ''));
        if (!isPhoneValid) {
            toast.error("Veuillez entrer un numéro de téléphone valide.");
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

    /**
     * handleSubmit: Orchestrates the auth flow with NextAuth.js
     * NOTE: Now uses NextAuth.js signIn for proper session management
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('🚀 [AUTH] Submit started', {
            activeTab,
            phoneNumber: phoneNumber ? phoneNumber.substring(0, 3) + '***' : 'empty',
            passwordLength: password.length
        });
        
        if (!validateForm()) {
            console.log('❌ [AUTH] Validation failed');
            return;
        }

        console.log('✅ [AUTH] Validation passed');
        setIsLoading(true);

        try {
            console.log('🔐 [AUTH] Calling NextAuth.js signIn...');

            // Use NextAuth.js signIn for credentials
            const result = await signIn('credentials', {
                phoneNumber,
                password,
                redirect: false, // Don't redirect automatically
            });

            console.log('� [AUTH] NextAuth.js result:', result);

            if (result?.error) {
                console.log('❌ [AUTH] NextAuth.js error:', result.error);
                toast.error("Numéro de téléphone ou mot de passe incorrect");
            } else if (result?.ok) {
                console.log('✅ [AUTH] NextAuth.js success');
                toast.success(`Bienvenue ! Redirection vers le dashboard...`);

                // Manual redirect after successful login
                setTimeout(() => {
                    console.log('🎯 [AUTH] Redirecting to /dashboard');
                    router.push('/dashboard');
                }, 1500);
            } else {
                console.log('⚠️ [AUTH] Unexpected NextAuth.js result:', result);
                toast.error("Une erreur inattendue s'est produite");
            }
            
        } catch (error) {
            console.error('💥 [AUTH] NextAuth.js error:', error);
            toast.error("Erreur de connexion au serveur");
        } finally {
            console.log('⏹️ [AUTH] Setting loading to false');
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Header Switcher (Molecule) */}
            <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} isLoading={isLoading} />

            <Card className="overflow-hidden border-border/50 shadow-xl shadow-primary/5">
                <CardHeader className="pb-4">
                    <CardTitle className="text-center text-3xl font-title text-foreground tracking-wide">
                        {activeTab === 'inscription' ? 'Créer un compte' : 'Bon retour !'}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* AnimatePresence handles the exit/entry animations during mode switching */}
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
                                    label="Numéro de téléphone"
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="0612345678"
                                    className="rounded-xl h-11"
                                    value={phoneNumber}
                                    onChange={(e: any) => setPhoneNumber(e.target.value)}
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
                                            {/* Custom inline spinner for the loading state */}
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
