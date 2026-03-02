'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/atoms/Base'
import { Disc as Discord, Mail } from 'lucide-react'

export default function Login() {
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
                </div>

                <div className="space-y-4 pt-4">
                    <form action={async (formData) => {
                        const phoneNumber = formData.get("phoneNumber")
                        const password = formData.get("password")
                        await signIn("credentials", { phoneNumber, password, callbackUrl: "/" })
                    }} className="space-y-3">
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
                        <Button type="submit" className="w-full py-4 tracking-wide font-bold shadow-lg shadow-[var(--primary)]/20">
                            Log In
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
