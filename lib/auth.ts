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
                console.log('[🔐 AUTH] 🔑 authorize() appelé avec credentials:', credentials)
                const { phoneNumber, password } = credentials as any

                if (!phoneNumber || !password) {
                    console.log('[🔐 AUTH] ❌ Credentials manquants')
                    return null
                }

                console.log('[🔐 AUTH] ℹ️ AUTH_URL:', process.env.AUTH_URL)
                console.log('[🔐 AUTH] 🔍 Recherche utilisateur pour:', phoneNumber)
                
                const user = await prisma.user.findFirst({
                    where: { phoneNumber }
                })

                if (!user) {
                    console.log('[🔐 AUTH] ❌ Utilisateur NON trouvé pour:', phoneNumber)
                    return null
                }
                if (!user.password) {
                    console.log('[🔐 AUTH] ❌ Utilisateur sans mot de passe pour:', phoneNumber)
                    return null
                }

                console.log('[🔐 AUTH] 🔐 Vérification du mot de passe...')
                const isValid = await bcrypt.compare(password, user.password)
                console.log('[🔐 AUTH] 🔐 Mot de passe valide:', isValid)
                
                if (!isValid) {
                    console.log('[🔐 AUTH] ❌ Mot de passe incorrect pour:', phoneNumber)
                    return null
                }

                console.log('[🔐 AUTH] ✅ Utilisateur authentifié avec succès:', user.id, user.displayName || user.username)
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
            console.log('[🔐 AUTH] 🍪 Session callback - token:', token, 'session:', session)
            if (token.sub) {
                session.user.id = token.sub
                console.log('[🔐 AUTH] 🍪 Session user ID mis à jour:', token.sub)
            }
            return session
        },
        async jwt({ token, user }: any) {
            console.log('[🔐 AUTH] 🎫 JWT callback - token:', token, 'user:', user)
            if (user) {
                token.sub = user.id
                console.log('[🔐 AUTH] 🎫 JWT token sub mis à jour:', user.id)
            }
            return token
        }
    }
})
