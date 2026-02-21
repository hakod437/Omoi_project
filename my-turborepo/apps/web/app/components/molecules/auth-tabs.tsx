"use client";

import { motion } from "framer-motion";

interface AuthTabsProps {
    activeTab: 'inscription' | 'connexion';
    setActiveTab: (tab: 'inscription' | 'connexion') => void;
    isLoading: boolean;
}

/**
 * MOLECULE: AuthTabs
 * 
 * Role: A specialized navigation component for switching between auth modes.
 * Design: High-fidelity iOS-style "Sliding Pill" animation.
 * Why a Molecule?
 * - It doesn't contain business logic (only UI state switching).
 * - It's a composition of buttons and a shared layoutId (framer-motion).
 */
export function AuthTabs({ activeTab, setActiveTab, isLoading }: AuthTabsProps) {
    return (
        <div className="relative flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-full mb-8 border border-border/50 shadow-sm">

            {/* 1. INSCRIPTION TAB */}
            <button
                onClick={() => setActiveTab('inscription')}
                disabled={isLoading}
                className={`relative flex-1 py-2 text-sm font-medium rounded-full transition-colors z-10 outline-none disabled:opacity-50 ${activeTab === 'inscription' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                Inscription
                {activeTab === 'inscription' && (
                    /* The "Animated Pill" uses layoutId to morph between buttons */
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                )}
            </button>

            {/* 2. CONNEXION TAB */}
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
    );
}
