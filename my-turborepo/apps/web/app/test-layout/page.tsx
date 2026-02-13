"use client";

import React from 'react';
import { LayoutContainer } from '../components/layout/layout-container';
import AuthForm from '../components/organisms/auth-form';

/**
 * TestLayoutPage (Template/Page level)
 * Using Atomic Design, this page only handles assembly and layout.
 * The complex logic and state are moved into the AuthForm organism.
 */
export default function TestLayoutPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <LayoutContainer className="max-w-md">
                <AuthForm />

                <p className="mt-8 text-xs text-center text-slate-400 font-light flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Atomic Design Refactor Complete
                </p>
            </LayoutContainer>
        </main>
    );
}
