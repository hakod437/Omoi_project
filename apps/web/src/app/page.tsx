"use client";
import React from "react";

import { Button } from "@/components/atoms/button";
import { GlassCard } from "@/components/molecules/glass-card";
import { VibeBadge } from "@/components/molecules/vibe-badge";
import { SectionHeader } from "@/components/molecules/section-header";
import { Surface } from "@/components/atoms/surface";
import { PageContainer } from "@/components/atoms/page-container";
import { ThemeShowcase } from "@/components/organisms/theme-showcase";
import { THEME_TOKENS } from "@/theme/tokens";
import { useTheme } from "./providers";

export default function Home() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  return (
    <PageContainer size="md" className="py-16">
      <Surface level="elevated" className="p-8 shadow-xl border">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Theme Playground</h1>
          <p className="text-white/40">
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
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
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
            <Surface level="base" className="p-8 border border-white/5">
              <h3 className="mb-4 text-sm font-medium text-white/40 uppercase">Base Surface</h3>
              <div className="grid grid-cols-2 gap-4">
                <Surface level="elevated" className="p-6 border border-white/10">
                  <p className="text-xs text-white/60">Elevated nested in Base</p>
                  <Button variant="outline" size="sm" className="mt-3">Action</Button>
                </Surface>
                <Surface level="deep" className="p-6 border border-white/5">
                  <p className="text-xs text-white/60">Deep nested in Base</p>
                  <VibeBadge score={42} className="mt-3" />
                </Surface>
              </div>
            </Surface>

            <Surface level="deep" className="p-8 border border-white/5">
              <h3 className="mb-4 text-sm font-medium text-white/40 uppercase">Deep Shell (Sidebar Style)</h3>
              <Surface level="elevated" className="p-6 border border-white/10">
                <p className="text-sm">Content hovering on deep background</p>
              </Surface>
            </Surface>
          </div>
        </section>

        <ThemeShowcase />
      </Surface>
    </PageContainer>
  );
}
