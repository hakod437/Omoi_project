import React from 'react'

interface AuthTemplateProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthTemplate({ children, title, subtitle }: AuthTemplateProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-kawaii text-[var(--foreground)] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[var(--foreground)]/60 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  )
}
