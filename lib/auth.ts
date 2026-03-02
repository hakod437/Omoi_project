import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // Required for Credentials provider
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Discord({
            clientId: process.env.AUTH_DISCORD_ID,
            clientSecret: process.env.AUTH_DISCORD_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                phoneNumber: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Auth-Authorize: Credentials received", credentials?.phoneNumber)
                if (!credentials?.phoneNumber || !credentials?.password) {
                    console.log("Auth-Authorize: Missing credentials")
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { phoneNumber: credentials.phoneNumber as string }
                    })

                    console.log("Auth-Authorize: User found", user?.id)

                    if (!user || !user.password) {
                        console.log("Auth-Authorize: User not found or no password")
                        return null
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    console.log("Auth-Authorize: Password valid", isValid)

                    if (!isValid) return null

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.displayName || user.username,
                        image: user.avatar,
                    }
                } catch (error) {
                    console.error("Auth-Authorize: Error in authorize", error)
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
})
