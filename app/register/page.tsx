'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
    const router = useRouter()
    
    // Rediriger vers la page de login avec le mode register
    React.useEffect(() => {
        router.push('/login?mode=register')
    }, [router])

    return (
        <div className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-4 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-2xl">
                <h1 className="text-4xl font-kawaii text-[var(--foreground)] tracking-tight text-center">
                    Redirection...
                </h1>
                <p className="text-center text-[var(--foreground)]/60 font-medium">
                    Redirection vers la page d'inscription...
                </p>
            </div>
        </div>
    )
}
