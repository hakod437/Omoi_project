"use client";
import React from "react";

import { Button } from "@/components/atoms/button";
import { GlassCard } from "@/components/molecules/glass-card";
import { VibeBadge } from "@/components/molecules/vibe-badge";
import { SectionHeader } from "@/components/molecules/section-header";
import { Surface } from "@/components/atoms/surface";
import { PageContainer } from "@/components/atoms/page-container";
import { THEME_TOKENS } from "@/theme/tokens";
import { useTheme } from "./providers";

export default function Home() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-white">Welcome to Omoi</h1>
      <p className="mt-4 text-white/80">Your anime tracking companion</p>
    </PageContainer>
  );
}
