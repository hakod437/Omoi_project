import React from 'react';

interface LayoutContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Un conteneur réutilisable pour centrer le contenu et gérer les marges.
 * Utilise la prop 'children' pour envelopper d'autres composants.
 */
export function LayoutContainer({ children, className = "" }: LayoutContainerProps) {
    return (
        <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
}
