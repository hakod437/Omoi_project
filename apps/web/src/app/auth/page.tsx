"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { PageContainer } from "@/components/atoms/page-container";
import { Surface } from "@/components/atoms/surface";
import { Button } from "@/components/atoms/button";
import { loginApi, registerApi } from "@/lib/auth";
import { useAuthStore } from "@/stores";

type AuthMode = "login" | "register";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});

const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    pseudo: z
      .string()
      .min(3, "Minimum 3 caractères")
      .max(24, "Maximum 24 caractères")
      .regex(/^[a-zA-Z0-9_.-]+$/, "Lettres, chiffres, tirets et underscores uniquement"),
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", pseudo: "", password: "", confirmPassword: "" },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => loginApi(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, pseudo }: RegisterForm) =>
      registerApi(email, password, pseudo),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/");
    },
  });

  return (
    <PageContainer size="md" className="relative py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,_var(--oi-primary-soft),_transparent_46%)]" />

      <Surface className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <p className="text-[0.78rem] uppercase tracking-[0.35em] text-[color:var(--oi-gold-bright)]/80">
          {mode === "login" ? "Bienvenue" : "Nouveau"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Omoi
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          {mode === "login"
            ? "Connecte-toi pour gérer ta liste, participer aux cercles et suivre les tendances locales."
            : "Crée un compte pour rejoindre la communauté et suivre tes animes."}
        </p>

        <div className="mt-6 flex gap-2 rounded-xl bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              loginForm.clearErrors();
              registerForm.clearErrors();
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              loginForm.clearErrors();
              registerForm.clearErrors();
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {mode === "login" && (
          <form
            onSubmit={loginForm.handleSubmit((data) =>
              loginMutation.mutate(data),
            )}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-white/60">Email</label>
              <input
                type="email"
                {...loginForm.register("email")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="exemple@email.com"
              />
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-white/60">
                Mot de passe
              </label>
              <input
                type="password"
                {...loginForm.register("password")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="••••••••"
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <p className="text-xs text-[var(--oi-danger)]">
                {loginMutation.error?.message || "Erreur de connexion"}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="h-12 w-full rounded-[var(--oi-radius-button)] text-base font-semibold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        )}

        {mode === "register" && (
          <form
            onSubmit={registerForm.handleSubmit((data) =>
              registerMutation.mutate(data),
            )}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-white/60">Email</label>
              <input
                type="email"
                {...registerForm.register("email")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="exemple@email.com"
              />
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-white/60">
                Pseudo
              </label>
              <input
                type="text"
                {...registerForm.register("pseudo")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="Ton pseudo"
              />
              {registerForm.formState.errors.pseudo && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {registerForm.formState.errors.pseudo.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-white/60">
                Mot de passe
              </label>
              <input
                type="password"
                {...registerForm.register("password")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-white/60">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                {...registerForm.register("confirmPassword")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-[var(--oi-danger)]">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {registerMutation.isError && (
              <p className="text-xs text-[var(--oi-danger)]">
                {registerMutation.error?.message || "Erreur d'inscription"}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="h-12 w-full rounded-[var(--oi-radius-button)] text-base font-semibold"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "Inscription..."
                : "Créer mon compte"}
            </Button>
          </form>
        )}
      </Surface>
    </PageContainer>
  );
}
