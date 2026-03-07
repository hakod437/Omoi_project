'use client'

import React, { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/atoms/Base'
import { Disc as Discord, Mail } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const registered = searchParams?.get('registered') === 'true'
    
    return (
        <div className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-kawaii text-[var(--foreground)] tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-[var(--foreground)]/60 font-medium">
                        Join the vault to rate your favorite peaks.
                    </p>
                    {registered && (
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold">
                            Account created successfully! Please log in.
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-4 pt-4">
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        setLoading(true)
                        setError(null)
                        
                        const formData = new FormData(e.currentTarget)
                        const phoneNumber = formData.get("phoneNumber") as string
                        const password = formData.get("password") as string
                        const displayName = formData.get("displayName") as string
                        
                        try {
                            const result = await signIn("credentials", { 
                                phoneNumber, 
                                password, 
                                displayName,
                                callbackUrl: "/", 
                                redirect: false 
                            })
                            
                            if (result?.error) {
                                setError("Invalid phone number or password")
                            } else if (result?.ok) {
                                router.push("/")
                            }
                        } catch (err) {
                            setError("Login failed. Please try again.")
                        } finally {
                            setLoading(false)
                        }
                    }} className="space-y-3">
                        <input
                            name="displayName"
                            type="text"
                            placeholder="Display Name (optional)"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                        />
                        <input
                            name="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                            required
                        />
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 tracking-wide font-bold shadow-lg shadow-[var(--primary)]/20"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </Button>
                    </form>

                    <div className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-[var(--border)]"></div>
                        <span className="text-xs font-bold text-[var(--foreground)]/30 uppercase tracking-widest">or</span>
                        <div className="h-px flex-1 bg-[var(--border)]"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            variant="outline"
                            className="py-4 flex items-center justify-center gap-2 border-[var(--border)] hover:bg-[var(--primary)]/10"
                        >
                            <Mail size={18} className="text-[#DB4437]" />
                            <span>Google</span>
                        </Button>

                        <Button
                            onClick={() => signIn('discord', { callbackUrl: '/' })}
                            variant="outline"
                            className="py-4 flex items-center justify-center gap-2 border-[var(--border)] hover:bg-[var(--primary)]/10"
                        >
                            <Discord size={18} className="text-[#5865F2]" />
                            <span>Discord</span>
                        </Button>
                    </div>
                </div>

                <p className="text-center text-sm text-[var(--foreground)]/60 font-medium pt-4">
                    New to the vault? <br />
                    <a href="/register" className="text-[var(--primary)] hover:underline font-bold">Create an account</a>
                </p>
            </div>
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[70vh] items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
                    <p className="mt-4 text-[var(--foreground)]/60">Loading...</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
