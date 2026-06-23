"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";
import { logoutApi } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, refreshToken, clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(refreshToken!),
    onSettled: () => {
      clearAuth();
      router.push("/auth");
    },
  });

  const handleAction = () => {
    if (isAuthenticated) {
      logoutMutation.mutate();
    } else {
      router.push("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-[var(--oi-bg-surface)] border-b border-[var(--oi-border-soft)] px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--oi-gold)] bg-[var(--oi-bg-deep)]">
            <span className="text-xs font-bold text-[var(--oi-gold)]">O</span>
          </div>
          <span className="text-base font-semibold text-white">omoi</span>
        </div>

        <button
          type="button"
          onClick={handleAction}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
