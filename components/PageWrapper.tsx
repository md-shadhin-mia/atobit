
import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string; // Allow additional classes if needed
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
    return (
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
            {children}
        </main>
    );
}
