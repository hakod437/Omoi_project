import type { DefaultSession, DefaultUser } from "next-auth"
import type { JWT as DefaultJWT } from "next-auth/jwt"
import type { UserRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string
            role: UserRole
        }
    }

    interface User extends DefaultUser {
        role: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role?: UserRole
    }
}