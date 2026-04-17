"use client";

import { Button } from "@/components/ui/button";
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
      </main>
    </div>
  );
}
