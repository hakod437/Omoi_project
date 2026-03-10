"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface DashboardStats {
    totalWatched: number;
    totalRated: number;
    averageRating: number | null;
    lastActivityAt: string | null;
}

const INITIAL_STATS: DashboardStats = {
    totalWatched: 0,
    totalRated: 0,
    averageRating: null,
    lastActivityAt: null,
};

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
    const [isRefreshingStats, setIsRefreshingStats] = useState(false);

    const displayName = session?.user?.name || 'Utilisateur';
    const isLoading = status === 'loading';

    const fetchUserStats = useCallback(async () => {
        setIsRefreshingStats(true);
        try {
            const response = await fetch('/api/users/stats', { method: 'GET' });
            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.error?.message || 'Impossible de charger les statistiques');
            }

            setStats({
                totalWatched: Number(data.data?.totalWatched ?? 0),
                totalRated: Number(data.data?.totalRated ?? 0),
                averageRating:
                    data.data?.averageRating === null || data.data?.averageRating === undefined
                        ? null
                        : Number(data.data.averageRating),
                lastActivityAt: data.data?.lastActivityAt ?? null,
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            toast.error('Impossible de charger les statistiques');
        } finally {
            setIsRefreshingStats(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Veuillez vous connecter pour accéder à cette page');
            router.push('/test-layout');
        }
    }, [router, status]);

    useEffect(() => {
        if (status === 'authenticated') {
            void fetchUserStats();
        }
    }, [fetchUserStats, status]);

    const lastActivityLabel = useMemo(() => {
        if (!stats.lastActivityAt) return 'Aucune activité';
        return new Date(stats.lastActivityAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }, [stats.lastActivityAt]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/test-layout' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Bienvenue, {displayName} ! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Voici votre tableau de bord personnel
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                        Déconnexion
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Animes vus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalWatched}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total des animes marqués comme vus
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Animes notés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalRated}</div>
                                <p className="text-xs text-muted-foreground">
                                    Nombre d&apos;animes avec une note
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Score moyen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.averageRating === null ? '-' : stats.averageRating.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Moyenne de vos notes utilisateur
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Dernière activité
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{lastActivityLabel}</div>
                                <p className="text-xs text-muted-foreground">
                                    Mise à jour des animes vus/notés
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Activité Récente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Aucune activité récente détaillée</p>
                                    <p className="text-sm mt-2">
                                        Les compteurs se mettent déjà à jour en temps réel via les stats.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions Rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" onClick={() => router.push('/animes')}>
                                    Explorer les Animes
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                                    Mon Profil
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={fetchUserStats}
                                    disabled={isRefreshingStats}
                                >
                                    {isRefreshingStats ? 'Rafraîchissement...' : 'Rafraîchir les Stats'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
