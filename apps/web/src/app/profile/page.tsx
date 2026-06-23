"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { PageContainer } from "@/components/atoms/page-container";
import { Surface } from "@/components/atoms/surface";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/stores";
import { logoutApi } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshToken, isAuthenticated, clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(refreshToken!),
    onSuccess: () => {
      clearAuth();
      router.push("/auth");
    },
    onError: () => {
      clearAuth();
      router.push("/auth");
    },
  });

  return (
    <PageContainer className="relative py-4">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_var(--oi-primary-soft),_transparent_42%)]" />
      <div className="space-y-5">
        <div>
          <p className="text-[0.78rem] uppercase tracking-[0.35em] text-[color:var(--oi-jade-bright)]">Profil</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Compte et préférences</h1>
          <p className="mt-3 max-w-xl text-base text-white/70">Gère ton identité, ton mode faible connexion et tes notifications.</p>
        </div>

        {isAuthenticated && user && (
          <Surface className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-white/45">Connecté en tant que</p>
            <p className="mt-1 text-lg font-medium text-white">{user.pseudo || "Sans pseudo"}</p>
            <p className="text-sm text-white/50">{user.email}</p>
          </Surface>
        )}

        <Surface className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-white/45">Section profil</p>
          <p className="mt-2 text-lg text-white/80">La structure UI est prête pour brancher les données utilisateur réelles.</p>
        </Surface>

        {isAuthenticated && (
          <div className="pt-4">
            <Button
              variant="destructive"
              className="h-12 w-full rounded-[var(--oi-radius-button)] text-base font-semibold"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Déconnexion..." : "Se déconnecter"}
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
