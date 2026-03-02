'use client'

import React from 'react'
import Link from 'next/link'
import { Search, User, BarChart3, TrendingUp, LogOut } from 'lucide-react'
import { Button } from '../atoms/Base'
import { useSession, signOut } from 'next-auth/react'

import { ThemeSwitcher } from '../molecules/ThemeSwitcher'

export const Navbar = () => {
    const { data: session } = useSession()

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
                <ThemeSwitcher />

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/trending" icon={<TrendingUp size={18} />} label="Trending" />
                    <NavLink href="/compare" icon={<BarChart3 size={18} />} label="Compare" />
                    {session && <NavLink href="/dashboard" icon={<User size={18} />} label="Dashboard" />}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-[var(--foreground)]/60 hover:text-[var(--primary)] transition-colors">
                        <Search size={22} />
                    </button>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="size-8 rounded-full bg-[var(--muted)] border border-[var(--border)] overflow-hidden">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="User" className="size-full object-cover" />
                                    ) : (
                                        <div className="size-full flex items-center justify-center font-bold text-xs">
                                            {session.user?.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-[var(--foreground)]/60 hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm" className="hidden sm:block">
                                Sign In
                            </Button>
                        </Link>
                    )}
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

