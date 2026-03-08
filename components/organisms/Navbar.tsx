'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, User, BarChart3 } from 'lucide-react'
import { Button } from '../atoms/Base'

import { ThemeSwitcher } from '../molecules/ThemeSwitcher'
import { SearchBar } from './SearchBar'

import { useSession, signOut } from 'next-auth/react'

export const Navbar = () => {
    const { data: session } = useSession()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
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

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 ml-12">
                    <NavLink href="/explorer" icon={<Search size={16} />} label="Explorer" />
                    <NavLink href="/compare" icon={<BarChart3 size={16} />} label="Sync" />
                    {session && <NavLink href="/dashboard" icon={<User size={16} />} label="Dashboard" />}
                </div>

                <div className="flex-1 hidden lg:flex max-w-xs mx-8">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <ThemeSwitcher />
                    </div>

                    <div className="flex items-center gap-2">
                        {session ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{session.user?.name}</span>
                                        <span className="text-[8px] font-bold text-[var(--primary)] uppercase tracking-widest">Omoi Master</span>
                                    </div>
                                    <Link href="/dashboard" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group/avatar">
                                        <User size={18} className="text-white/40 group-hover/avatar:text-[var(--primary)] transition-colors" />
                                    </Link>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut()}
                                    className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
                                >
                                    Log Out
                                </Button>
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
        </nav>
    )
}

const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link
        href={href}
        className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all"
    >
        {icon}
        <span>{label}</span>
    </Link>
)

