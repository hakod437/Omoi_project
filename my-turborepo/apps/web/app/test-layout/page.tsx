import React from 'react';
import { LayoutContainer } from '../components/layout/layout-container';

export default function TestLayoutPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <LayoutContainer>
                <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                        Créer un Formulaire
                    </h1>

                    <form className="space-y-4">
                        {/* 1. CHAMP EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Adresse Email
                            </label>
                            {/* type="email" aide le navigateur à valider le format */}
                            <input
                                type="email"
                                placeholder="nom@exemple.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>

                        {/* 2. CHAMP MOT DE PASSE */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Mot de passe
                            </label>
                            {/* type="password" masque les caractères par des points */}
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>

                        {/* 3. LE BOUTON */}
                        {/* type="submit" indique que ce bouton valide le formulaire parent */}
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
                        >
                            C'est parti !
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-center text-slate-400">
                        Note : Les classes comme "w-full" ou "bg-primary" sont du Tailwind CSS.
                    </p>
                </div>
            </LayoutContainer>
        </main>
    );
}
