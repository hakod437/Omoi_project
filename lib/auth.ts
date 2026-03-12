import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

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
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub) {
                session.user.id = token.sub
            }
            session.user.role = (token.role as UserRole | undefined) || UserRole.USER
            return session
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id
                token.role = user.role
            }
            return token
        }
    }
})
