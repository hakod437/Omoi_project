import { z } from "zod";

/**
 * Type-safe environment variable access for the frontend.
 * Only NEXT_PUBLIC_ variables are available client-side.
 */
export const env = {
    posthog: {
        key: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
        host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    },
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
} as const;
