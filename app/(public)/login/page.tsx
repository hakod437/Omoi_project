'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { registerWithPhoneAction, loginWithPhoneAction } from '@/actions/auth.actions'
import { Button } from '@/components/atoms/Base'
import { Phone, User, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white/20">Chargement...</div>}>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const searchParams = useSearchParams()
    const mode = searchParams?.get('mode')
    let callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'

    // Prevent open redirect attacks
    if (callbackUrl && (!callbackUrl.startsWith('/') || callbackUrl.includes('://'))) {
        callbackUrl = '/dashboard'
    }
    const [isLogin, setIsLogin] = useState(mode !== 'register')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    useEffect(() => {
        if (mode === 'register') {
            setIsLogin(false)
        } else if (mode === 'login') {
            setIsLogin(true)
        }
    }, [mode])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('[🔐 LOGIN] 🚀 Début du handleSubmit - isLogin:', isLogin)
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const phoneNumber = formData.get('phoneNumber') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string

        console.log('[🔐 LOGIN] 📝 Données du formulaire:', { phoneNumber: phoneNumber?.substring(0, 8) + '...', password: password ? '***' : 'null', username })

        if (!isLogin) {
            // S'il s'agit d'une inscription, on crée d'abord le compte
            console.log('[🔐 LOGIN] 📝 Mode inscription - Création du compte...')
            const res = await registerWithPhoneAction(formData)
            console.log('[🔐 LOGIN] 📝 Résultat inscription:', res)
            if (!res.success) {
                console.log('[🔐 LOGIN] ❌ Erreur inscription:', res.error)
                setMessage({ type: 'error', text: res.error || "Erreur lors de l'inscription" })
                setLoading(false)
                return
            }
            console.log('[🔐 LOGIN] ✅ Compte créé avec succès')
        }

        // Connexion via NextAuth signIn
        console.log('[🔐 LOGIN] 🔑 Tentative de connexion...')
        const result = await signIn('credentials', { phoneNumber, password, callbackUrl, redirect: false })
        console.log('[🔐 LOGIN] 🔑 Résultat connexion:', result)

        if (!result?.ok) {
            console.log('[🔐 LOGIN] ❌ Connexion échouée:', result?.error)
            setMessage({ type: 'error', text: "Identifiants invalides" })
        } else {
            console.log('[🔐 LOGIN] ✅ Connexion réussie!')
            // Redirect to intended page
            router.push(callbackUrl)
        }
        setLoading(false)
        console.log('[🔐 LOGIN] 🏁 Fin du handleSubmit')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-transparent relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[var(--glass-shadow)] flex flex-col gap-6">
                    <div className="space-y-2 text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex p-3 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-2"
                        >
                            <Sparkles size={28} />
                        </motion.div>
                        <h1 className="text-4xl font-kawaii text-white tracking-tight">
                            {isLogin ? 'Bon retour !' : 'Rejoindre Omoi'}
                        </h1>
                        <p className="text-white/40 font-medium text-sm">
                            {isLogin ? 'Connectez-vous pour voir vos tiers' : 'Créez votre profil Omoi'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="username"
                                            placeholder="Nom d'utilisateur"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[var(--primary)]/50 focus:bg-white/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="displayName"
                                            placeholder="Nom d'affichage (Optionnel)"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[var(--primary)]/50 focus:bg-white/10 outline-none transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                name="phoneNumber"
                                type="tel"
                                placeholder="Numéro de téléphone"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[var(--primary)]/50 focus:bg-white/10 outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[var(--primary)]/50 focus:bg-white/10 outline-none transition-all"
                            />
                        </div>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-sm font-bold text-center ${message.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                            >
                                {message.text}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:opacity-90 shadow-[var(--glow)] border-none flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Traitement...' : isLogin ? 'Se connecter' : "S'inscrire"}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="pt-4 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white/40 hover:text-white text-sm font-semibold transition-colors"
                        >
                            {isLogin ? "Vous n'avez pas de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
