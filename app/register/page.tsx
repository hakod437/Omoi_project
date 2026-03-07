'use client'

import React from 'react'

export default function Register() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-4 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-2xl">
                <h1 className="text-4xl font-kawaii text-[var(--foreground)] tracking-tight text-center">
                    Register
                </h1>
                <p className="text-center text-[var(--foreground)]/60 font-medium">
                    Le backend (auth/DB) a été supprimé. Cette page est temporairement désactivée.
                </p>
            </div>
        </div>
    )
}
