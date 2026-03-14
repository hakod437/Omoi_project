import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

type AniListViewerProfile = {
    id: number | string
    name?: string | null
    avatar?: {
        large?: string | null
        medium?: string | null
    } | null
}

const ANILIST_PROVIDER_ID = "anilist"
const ANILIST_OAUTH_AUTHORIZE_URL = "https://anilist.co/api/v2/oauth/authorize"
const ANILIST_OAUTH_TOKEN_URL = "https://anilist.co/api/v2/oauth/token"
const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co"

const normalizeUsername = (value: string): string => {
    const normalized = value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")

    return normalized.slice(0, 24) || "anilist_user"
}

async function getUniqueUsername(base: string, fallbackSuffix: string): Promise<string> {
    const normalizedBase = normalizeUsername(base)

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const suffix = attempt === 0 ? "" : `_${fallbackSuffix.slice(0, 6)}_${attempt}`
        const candidate = normalizeUsername(`${normalizedBase}${suffix}`).slice(0, 30)
        const existing = await prisma.user.findUnique({ where: { username: candidate } })
        if (!existing) {
            return candidate
        }
    }

    return normalizeUsername(`anilist_${fallbackSuffix}_${Date.now().toString().slice(-4)}`).slice(0, 30)
}

async function fetchAniListViewerProfile(accessToken: string): Promise<AniListViewerProfile> {
    const response = await fetch(ANILIST_GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            query: `
              query ViewerProfile {
                Viewer {
                  id
                  name
                  avatar {
                    large
                    medium
                  }
                }
              }
            `,
        }),
    })

    if (!response.ok) {
        throw new Error(`AniList userinfo request failed (${response.status})`)
    }

    const payload = (await response.json()) as {
        data?: { Viewer?: AniListViewerProfile }
        errors?: Array<{ message?: string }>
    }

    if (!payload?.data?.Viewer) {
        const errorMessage = payload?.errors?.[0]?.message || "Missing AniList viewer payload"
        throw new Error(errorMessage)
    }

    return payload.data.Viewer
}

async function syncAniListAccount(params: {
    providerAccountId: string
    profile: AniListViewerProfile
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: number | null
    scope?: string | null
    tokenType?: string | null
}): Promise<{ id: string; role: UserRole; email: string; username: string; displayName: string | null }> {
    const email = `anilist_${params.profile.id}@oauth.omoi.local`
    const avatarUrl = params.profile.avatar?.large || params.profile.avatar?.medium || null
    const displayName = params.profile.name || `AniList ${params.profile.id}`

    const existingAccount = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider: ANILIST_PROVIDER_ID,
                providerAccountId: params.providerAccountId,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    role: true,
                    email: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    })

    if (existingAccount) {
        await prisma.user.update({
            where: { id: existingAccount.userId },
            data: {
                displayName,
                avatar: avatarUrl,
            },
        })

        await prisma.account.update({
            where: { id: existingAccount.id },
            data: {
                access_token: params.accessToken ?? null,
                refresh_token: params.refreshToken ?? null,
                expires_at: params.expiresAt ?? null,
                scope: params.scope ?? null,
                token_type: params.tokenType ?? null,
            },
        })

        return existingAccount.user
    }

    let user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            role: true,
            email: true,
            username: true,
            displayName: true,
        },
    })

    if (!user) {
        const usernameBase = params.profile.name ? `anilist_${params.profile.name}` : `anilist_${params.profile.id}`
        const username = await getUniqueUsername(usernameBase, String(params.profile.id))

        user = await prisma.user.create({
            data: {
                email,
                username,
                displayName,
                avatar: avatarUrl,
            },
            select: {
                id: true,
                role: true,
                email: true,
                username: true,
                displayName: true,
            },
        })
    }

    await prisma.account.upsert({
        where: {
            provider_providerAccountId: {
                provider: ANILIST_PROVIDER_ID,
                providerAccountId: params.providerAccountId,
            },
        },
        update: {
            userId: user.id,
            access_token: params.accessToken ?? null,
            refresh_token: params.refreshToken ?? null,
            expires_at: params.expiresAt ?? null,
            scope: params.scope ?? null,
            token_type: params.tokenType ?? null,
        },
        create: {
            userId: user.id,
            type: "oauth",
            provider: ANILIST_PROVIDER_ID,
            providerAccountId: params.providerAccountId,
            access_token: params.accessToken ?? null,
            refresh_token: params.refreshToken ?? null,
            expires_at: params.expiresAt ?? null,
            scope: params.scope ?? null,
            token_type: params.tokenType ?? null,
        },
    })

    return user
}

const providers: any[] = [
    Credentials({
        name: "Credentials",
        credentials: {
            phoneNumber: { label: "Phone", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            const { phoneNumber, password } = credentials as any

            if (!phoneNumber || !password) {
                return null
            }

            const user = await prisma.user.findFirst({
                where: { phoneNumber }
            })

            if (!user) {
                return null
            }
            if (!user.password) {
                return null
            }

            const isValid = await bcrypt.compare(password, user.password)

            if (!isValid) {
                return null
            }

            return {
                id: user.id,
                name: user.displayName || user.username,
                email: user.email,
                role: user.role,
            }
        }
    })
]

const aniListClientId = process.env.ANILIST_CLIENT_ID
const aniListClientSecret = process.env.ANILIST_CLIENT_SECRET

if (aniListClientId && aniListClientSecret) {
    providers.push({
        id: ANILIST_PROVIDER_ID,
        name: "AniList",
        type: "oauth",
        clientId: aniListClientId,
        clientSecret: aniListClientSecret,
        authorization: {
            url: ANILIST_OAUTH_AUTHORIZE_URL,
            params: {
                response_type: "code",
            },
        },
        token: ANILIST_OAUTH_TOKEN_URL,
        userinfo: {
            url: ANILIST_GRAPHQL_URL,
            async request({ tokens }: any) {
                if (!tokens?.access_token) {
                    throw new Error("Missing AniList access token")
                }

                return fetchAniListViewerProfile(tokens.access_token)
            },
        },
        profile(profile: AniListViewerProfile) {
            return {
                id: String(profile.id),
                name: profile.name || `AniList ${profile.id}`,
                email: `anilist_${profile.id}@oauth.omoi.local`,
                image: profile.avatar?.large || profile.avatar?.medium || null,
            }
        },
    })
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account?.provider !== ANILIST_PROVIDER_ID) {
                return true
            }

            try {
                const providerAccountId = account.providerAccountId || profile?.id?.toString()
                if (!providerAccountId) {
                    return false
                }

                const normalizedProfile: AniListViewerProfile = {
                    id: profile?.id || providerAccountId,
                    name: profile?.name || null,
                    avatar: profile?.avatar || null,
                }

                const syncedUser = await syncAniListAccount({
                    providerAccountId,
                    profile: normalizedProfile,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at,
                    scope: account.scope,
                    tokenType: account.token_type,
                })

                user.id = syncedUser.id
                user.role = syncedUser.role
                user.email = syncedUser.email
                user.name = syncedUser.displayName || syncedUser.username

                return true
            } catch (error) {
                console.error("[AUTH] AniList sign-in failed", error)
                return false
            }
        },
        async session({ session, token }: any) {
            if (token.sub) {
                session.user.id = token.sub
            }
            session.user.role = (token.role as UserRole | undefined) || UserRole.USER
            return session
        },
        async jwt({ token, user, account }: any) {
            if (account?.provider === ANILIST_PROVIDER_ID && account.providerAccountId) {
                const dbAccount = await prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: ANILIST_PROVIDER_ID,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                    include: {
                        user: {
                            select: {
                                role: true,
                            },
                        },
                    },
                })

                if (dbAccount) {
                    token.sub = dbAccount.userId
                    token.role = dbAccount.user.role
                }
            }

            if (user) {
                token.sub = user.id
                token.role = user.role
            }
            return token
        }
    }
})
