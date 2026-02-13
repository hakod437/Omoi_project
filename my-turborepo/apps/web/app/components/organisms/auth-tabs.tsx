"use client";

import { motion } from "framer-motion";

interface AuthTabsProps {
    activeTab: 'inscription' | 'connexion';
    setActiveTab: (tab: 'inscription' | 'connexion') => void;
    isLoading: boolean;
}

/**
 * AuthTabs Organism
 * Handles the iOS-style sliding animation for tab switching.
 */
export function AuthTabs({ activeTab, setActiveTab, isLoading }: AuthTabsProps) {
    return (
        <div className="relative flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-full mb-8 border border-slate-200/50 shadow-sm">
            {/* BOUTON INSCRIPTION */}
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

            {/* BOUTON CONNEXION */}
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
