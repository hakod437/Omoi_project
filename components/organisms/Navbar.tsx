'use client'

import React from 'react'
import Link from 'next/link'
import { Search, User, BarChart3 } from 'lucide-react'
import { Button } from '../atoms/Base'

import { ThemeSwitcher } from '../molecules/ThemeSwitcher'
import { SearchBar } from './SearchBar'

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-8 rounded-lg bg-[var(--primary)] flex items-center justify-center transition-transform group-hover:rotate-12">
                        <span className="font-kawaii text-xl text-white">V</span>
                    </div>
                    <span className="font-kawaii text-2xl tracking-tighter text-[var(--foreground)]">
                        AnimeVault
                    </span>
                </Link>
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    <NavLink href="/explorer" icon={<Search size={18} />} label="Explorer" />
                    <NavLink href="/compare" icon={<BarChart3 size={18} />} label="Sync" />
                    <NavLink href="/dashboard" icon={<User size={18} />} label="Vault" />
                </div>

                {/* Search Bar - Only on large screens */}
                <div className="hidden lg:flex flex-1 max-w-xs mx-8">
                    <SearchBar />
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <ThemeSwitcher />
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" size="sm" className="text-xs uppercase tracking-widest px-6 shadow-primary/20">
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
        className="flex items-center gap-2 font-ui font-bold text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
    >
        {icon}
        <span>{label}</span>
    </Link>
)

