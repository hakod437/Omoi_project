import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                displayName: { label: "Display Name", type: "text" },
                phoneNumber: { label: "Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Auth-Authorize: Credentials received", credentials?.phoneNumber)
                
                if (!credentials?.phoneNumber || !credentials?.password) {
                    console.log("Auth-Authorize: Missing credentials")
                    return null
                }

                const displayName = credentials.displayName as string || "Test User"

                // Mock authentication pour les tests
                if (credentials.phoneNumber === "+33612345678" && credentials.password === "testpass123") {
                    console.log("Auth-Authorize: Test user authenticated")
                    return {
                        id: "test-user-id",
                        email: "test@example.com",
                        name: displayName,
                        image: null,
                    }
                }

                // Pour tout autre numéro commençant par + avec mot de passe >=6 chars
                if (credentials.phoneNumber?.toString().startsWith("+") && credentials.password?.toString().length >= 6) {
                    console.log("Auth-Authorize: Mock user authenticated")
                    return {
                        id: "mock-user-id",
                        email: "mock@example.com",
                        name: displayName,
                        image: null,
                    }
                }

                console.log("Auth-Authorize: Invalid credentials")
                return null
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "default-secret-for-development-32-chars-min",
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.id
                session.user.name = token.name || ''
                session.user.email = token.email || ''
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
}

export default NextAuth(authOptions)
