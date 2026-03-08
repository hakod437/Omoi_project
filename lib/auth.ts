import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                phoneNumber: { label: "Phone", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { phoneNumber, password } = credentials as any

                if (!phoneNumber || !password) return null

                console.log("[Auth] AUTH_URL:", process.env.AUTH_URL)
                console.log("[Auth] Authorize credentials:", credentials)
                console.log("[Auth] Authorize attempt for:", phoneNumber)
                const user = await prisma.user.findFirst({
                    where: { phoneNumber }
                })

                if (!user) {
                    console.log("[Auth] User NOT found for:", phoneNumber)
                    return null
                }
                if (!user.password) {
                    console.log("[Auth] User has NO password for:", phoneNumber)
                    return null
                }

                const isValid = await bcrypt.compare(password, user.password)
                console.log("[Auth] Password valid:", isValid)
                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.displayName || user.username,
                    email: user.email
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub) session.user.id = token.sub
            return session
        }
    }
})
