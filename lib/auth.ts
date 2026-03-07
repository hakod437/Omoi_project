import { getSession } from "next-auth/react"
import { useSession } from "next-auth/react"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export { getSession, useSession, authOptions }

// Export auth pour compatibilité avec les imports existants
export async function auth() {
    return await getSession()
}
