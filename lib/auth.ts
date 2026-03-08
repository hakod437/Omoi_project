import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Pour le moment on accepte tout pour le test
                if (credentials?.username === "hakuo" && credentials?.password === "password") {
                    return { id: "temp-user-id", name: "Hakuo", email: "hakuo@example.com" }
                }
                return null
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
