/**
 * Dashboard Page
 * 
 * Main dashboard after user authentication
 * 
 * @module app/dashboard/page
 */

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    bio?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('🏠 [DASHBOARD] Dashboard component mounted');
        
        // Check authentication
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        console.log('🔍 [DASHBOARD] Authentication check:', {
            hasToken: !!token,
            tokenLength: token?.length || 0,
            hasUserData: !!userData,
            userDataLength: userData?.length || 0
        });
        
        if (!token || !userData) {
            console.log('❌ [DASHBOARD] No auth data found, redirecting to login');
            toast.error('Veuillez vous connecter pour accéder à cette page');
            router.push('/test-layout');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            console.log('✅ [DASHBOARD] User data parsed successfully:', {
                id: parsedUser.id,
                email: parsedUser.email,
                displayName: parsedUser.displayName
            });
            setUser(parsedUser);
        } catch (error) {
            console.error('💥 [DASHBOARD] Error parsing user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            router.push('/test-layout');
        } finally {
            console.log('⏹️ [DASHBOARD] Loading completed');
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        console.log('🚪 [DASHBOARD] Logout initiated');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.log('🗑️ [DASHBOARD] Auth data cleared from localStorage');
        toast.success('Déconnexion réussie');
        console.log('🔄 [DASHBOARD] Redirecting to login page');
        router.push('/test-layout');
    };

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/users/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('User stats:', data);
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Bienvenue, {user.displayName} ! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Voici votre tableau de bord personnel
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                        Déconnexion
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Animes Notés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Total des animes évalués
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
                                    Amis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Amis connectés
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
                                    Score Moyen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground">
                                    Votre note moyenne
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
                                    Membre depuis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Aujourd'hui</div>
                                <p className="text-xs text-muted-foreground">
                                    Date d'inscription
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
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
                                    <p>Aucune activité récente</p>
                                    <p className="text-sm mt-2">
                                        Commencez à noter des animes pour voir votre activité ici !
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
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
                                <Button 
                                    className="w-full" 
                                    onClick={() => router.push('/animes')}
                                >
                                    Explorer les Animes
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => router.push('/profile')}
                                >
                                    Mon Profil
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={fetchUserStats}
                                >
                                    Rafraîchir les Stats
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
