"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { VibeBadge } from "@/components/ui/vibe-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Surface } from "@/components/ui/mini_layout";
import { THEME_TOKENS } from "@/theme/tokens";
import { useTheme } from "./providers";

export default function Home() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <main
        className="w-full max-w-3xl rounded-2xl border p-8 shadow-xl"
        style={{
          backgroundColor: "var(--color-surface-panel)",
          borderColor: "var(--color-border-default)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Theme Playground</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Mode actif: <strong>{themeMode}</strong> | rendu: <strong>{resolvedTheme}</strong>
          </p>
        </div>

        <section className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={themeMode === "system" ? "primary" : "outline"}
            onClick={() => setThemeMode("system")}
          >
            System
          </Button>
          <Button
            variant={themeMode === "light" ? "primary" : "outline"}
            onClick={() => setThemeMode("light")}
          >
            Light
          </Button>
          <Button
            variant={themeMode === "dark" ? "primary" : "outline"}
            onClick={() => setThemeMode("dark")}
          >
            Dark
          </Button>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg">Primary</Button>
          <Button variant="secondary" size="lg">Secondary</Button>
          <Button variant="outline" size="lg">Outline</Button>
          <Button variant="ghost" size="lg">Ghost</Button>
          <Button variant="destructive" size="lg">Destructive</Button>
        </section>

        <section className="mt-12 space-y-4">
          <SectionHeader
            title="Component Showcase"
            action={<VibeBadge score={98} />}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard lowConnection={false} className="p-6">
              <h3 className="mb-2 font-medium">Standard Connection</h3>
              <p className="text-sm text-white/60">
                This card uses the full `backdrop-filter` and glass background.
              </p>
            </GlassCard>

            <GlassCard lowConnection={true} className="p-6">
              <h3 className="mb-2 font-medium">Low Connection Mode</h3>
              <p className="text-sm text-white/60">
                This version disables expensive blurs to improve performance.
              </p>
            </GlassCard>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <SectionHeader title="Surface Architecture" />

          <div className="grid gap-6">
            <Surface level="base" className="p-8">
              <h3 className="mb-4 text-sm font-medium text-white/40 uppercase">Base Surface</h3>
              <div className="grid grid-cols-2 gap-4">
                <Surface level="elevated" className="p-6">
                  <p className="text-xs text-white/60">Elevated nested in Base</p>
                  <Button variant="outline" size="sm" className="mt-3">Action</Button>
                </Surface>
                <Surface level="deep" className="p-6">
                  <p className="text-xs text-white/60">Deep nested in Base</p>
                  <VibeBadge score={42} className="mt-3" />
                </Surface>
              </div>
            </Surface>

            <Surface level="deep" className="p-8">
              <h3 className="mb-4 text-sm font-medium text-white/40 uppercase">Deep Shell (Sidebar Style)</h3>
              <Surface level="elevated" className="p-6">
                <p className="text-sm">Content hovering on deep background</p>
              </Surface>
            </Surface>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <SectionHeader title="Design Tokens" />

          <div className="space-y-8">
            {/* Colors */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">Colors</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Object.entries(THEME_TOKENS.colors).map(([name, value]) => (
                  <div key={name} className="space-y-2">
                    <div
                      className="h-16 w-full rounded-lg border border-white/10"
                      style={{ backgroundColor: value }}
                    />
                    <div className="px-1">
                      <p className="text-xs font-medium text-white">{name}</p>
                      <p className="text-[10px] text-white/40 uppercase">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">Effects & Variables</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  className="oi-surface-glass p-8 shadow-[var(--oi-shadow-card)]"
                  style={{ borderRadius: 16 }}
                >
                  <p className="text-center text-sm font-medium">Card Shadow (var)</p>
                </div>
                <div
                  className="oi-surface-glass p-8 shadow-[var(--oi-shadow-gold-glow)]"
                  style={{ borderRadius: 16 }}
                >
                  <p className="text-center text-sm font-medium text-[#c8a96b]">Gold Glow (var)</p>
                </div>
              </div>
            </div>

            {/* Radius */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">Corner Radius</h3>
              <div className="flex flex-wrap gap-4">
                <div
                  className="bg-white/10 p-6 text-xs text-white"
                  style={{ borderRadius: THEME_TOKENS.radius.card, border: "1px solid white" }}
                >
                  Card ({THEME_TOKENS.radius.card})
                </div>
                <div
                  className="bg-white/10 p-6 text-xs text-white"
                  style={{ borderRadius: THEME_TOKENS.radius.panel, border: "1px solid white" }}
                >
                  Panel ({THEME_TOKENS.radius.panel})
                </div>
                <div
                  className="bg-white/10 p-6 text-xs text-white"
                  style={{ borderRadius: THEME_TOKENS.radius.button, border: "1px solid white" }}
                >
                  Button ({THEME_TOKENS.radius.button})
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
