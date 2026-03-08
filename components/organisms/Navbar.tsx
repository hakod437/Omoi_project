'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, User, BarChart3 } from 'lucide-react'
import { Button } from '../atoms/Base'

import { ThemeSwitcher } from '../molecules/ThemeSwitcher'
import { SearchBar } from './SearchBar'

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="size-10 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-[var(--glow)]"
                    >
                        <span className="font-kawaii text-2xl text-white">V</span>
                    </motion.div>
                    <span className="font-kawaii text-2xl font-black tracking-tight text-white group-hover:text-[var(--primary)] transition-colors">
                        AnimeVault
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 ml-12">
                    <NavLink href="/explorer" icon={<Search size={16} />} label="Explorer" />
                    <NavLink href="/compare" icon={<BarChart3 size={16} />} label="Sync" />
                    <NavLink href="/dashboard" icon={<User size={16} />} label="Vault" />
                </div>

                <div className="flex-1 hidden lg:flex max-w-xs mx-8">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <ThemeSwitcher />
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100">
                                Login
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="bg-white/10 hover:bg-[var(--primary)] border-none text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-2xl shadow-none">
                                Join
                            </Button>
                        </Link>
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

