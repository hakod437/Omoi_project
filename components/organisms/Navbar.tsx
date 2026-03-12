'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { User, BarChart3, LayoutDashboard, Compass, Menu, X, LogOut } from 'lucide-react'
import { Button } from '../atoms/Base'

import { ThemeSwitcher } from '../molecules/ThemeSwitcher'
import { SearchBar } from './SearchBar'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

/**
 * Navbar principale de l'application.
 * 
 * - Non connecté : affiche Login / Join
 * - Connecté : affiche les liens de navigation (Explorer, Sync, Dashboard) + menu mobile
 */
export const Navbar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const isCompareRoute = pathname === '/compare' || pathname === '/sync'

    // Liens de navigation (visibles uniquement si connecté)
    const navLinks = [
        { href: '/explorer', icon: <Compass size={16} />, label: 'Explorer' },
        { href: '/compare', icon: <BarChart3 size={16} />, label: 'Compare' },
        { href: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    ]

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="size-10 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-[var(--glow)]"
                    >
                        <span className="font-kawaii text-2xl text-white">O</span>
                    </motion.div>
                    <span className="font-kawaii text-2xl font-black tracking-tight text-white group-hover:text-[var(--primary)] transition-colors">
                        Omoi
                    </span>
                </Link>

                {/* Desktop Links — visibles uniquement si connecté */}
                {session && (
                    <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 ml-12">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                icon={link.icon}
                                label={link.label}
                                isActive={link.href === '/compare' ? isCompareRoute : pathname === link.href}
                            />
                        ))}
                    </div>
                )}

                {/* Search Bar (desktop) — visible uniquement si connecté */}
                {session && (
                    <div className="flex-1 hidden lg:flex max-w-xs mx-8">
                        <SearchBar />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <ThemeSwitcher />
                    </div>

                    <div className="flex items-center gap-2">
                        {session ? (
                            <div className="flex items-center gap-6">
                                {/* User info (desktop) */}
                                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{session.user?.name}</span>
                                        <span className="text-[8px] font-bold text-[var(--primary)] uppercase tracking-widest">Omoi Master</span>
                                    </div>
                                    <Link href="/dashboard" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group/avatar">
                                        <User size={18} className="text-white/40 group-hover/avatar:text-[var(--primary)] transition-colors" />
                                    </Link>
                                </div>

                                {/* Logout (desktop) */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="hidden sm:flex text-[9px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
                                >
                                    Log Out
                                </Button>

                                {/* Mobile hamburger button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? (
                                        <X size={20} className="text-white" />
                                    ) : (
                                        <Menu size={20} className="text-white" />
                                    )}
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login?mode=login">
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/login?mode=register">
                                    <Button className="bg-white/10 hover:bg-[var(--primary)] border-none text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-2xl shadow-none">
                                        Join
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu — visible uniquement si connecté et menu ouvert */}
            <AnimatePresence>
                {session && mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden border-t border-white/5 bg-[#0A0A0B]/95 backdrop-blur-2xl"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${(link.href === '/compare' ? isCompareRoute : pathname === link.href)
                                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            {/* Mobile user info + logout */}
                            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <User size={14} className="text-white/40" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white uppercase tracking-tight">{session.user?.name}</span>
                                        <span className="text-[8px] font-bold text-[var(--primary)] uppercase tracking-widest">Omoi Master</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                >
                                    <LogOut size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

/**
 * Lien de navigation avec indicateur d'état actif.
 */
const NavLink = ({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean }) => (
    <Link
        href={href}
        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${isActive
                ? 'bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
)
