'use client';

/**
 * User Menu Component
 * 
 * Shows user profile and auth actions in the header.
 * 
 * @module app/components/user-menu
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { User, LogOut, Settings, Loader2 } from 'lucide-react';

export function UserMenu() {
    const { user, profile, loading, signOut } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const router = useRouter();

    if (loading) {
        return (
            <Button variant="ghost" size="sm" disabled>
                <Loader2 className="size-4 animate-spin" />
            </Button>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>
                    Connexion
                </Button>
                <Button size="sm" onClick={() => router.push('/auth/register')}>
                    S'inscrire
                </Button>
            </div>
        );
    }

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
    };

    const displayName = profile?.display_name || user.email?.split('@')[0] || 'Utilisateur';
    const avatarUrl = profile?.avatar_url;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowMenu(!showMenu)}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="size-6 rounded-full"
                    />
                ) : (
                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="size-4 text-primary" />
                    </div>
                )}
                <span className="hidden sm:inline">{displayName}</span>
            </Button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />
                    <Card className="absolute right-0 top-full mt-2 w-48 p-2 z-50 shadow-lg">
                        <div className="px-2 py-1.5 text-sm text-muted-foreground border-b mb-2">
                            {user.email}
                        </div>

                        <button
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => {
                                setShowMenu(false);
                                router.push('/profile');
                            }}
                        >
                            <Settings className="size-4" />
                            Paramètres
                        </button>

                        <button
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                            onClick={handleSignOut}
                            disabled={signingOut}
                        >
                            {signingOut ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <LogOut className="size-4" />
                            )}
                            Déconnexion
                        </button>
                    </Card>
                </>
            )}
        </div>
    );
}
