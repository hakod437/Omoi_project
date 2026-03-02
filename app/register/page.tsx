'use client'

import React, { useState } from 'react'
import { registerWithPhoneAction } from '@/actions/auth.actions'
import { Button } from '@/components/atoms/Base'
import { useRouter } from 'next/navigation'

export default function Register() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await registerWithPhoneAction(formData)
        if (result.success) {
            router.push('/login?registered=true')
        } else {
            setError(result.error || "Something went wrong")
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-kawaii text-[var(--foreground)] tracking-tight">
                        Join the Vault
                    </h1>
                    <p className="text-[var(--foreground)]/60 font-medium">
                        Secure your spot in the anime elite.
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40 ml-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="e.g. kirito_kun"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40 ml-1">Phone Number</label>
                        <input
                            name="phoneNumber"
                            type="text"
                            placeholder="+1 234 567 890"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 tracking-wide font-bold shadow-lg shadow-[var(--primary)]/20 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </Button>
                </form>

                <p className="text-center text-sm text-[var(--foreground)]/60 font-medium pt-4">
                    Already have an account? <br />
                    <a href="/login" className="text-[var(--primary)] hover:underline font-bold">Log in here</a>
                </p>
            </div>
        </div>
    )
}
