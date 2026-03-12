import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

function parseCsvEnv(value?: string) {
    return new Set(
        (value || "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
    )
}

export async function requireAdminUser() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            role: true,
        },
    })

    if (!user) {
        throw new Error("Unauthorized")
    }

    const allowedIds = parseCsvEnv(process.env.ADMIN_USER_IDS)
    const allowedEmails = parseCsvEnv(process.env.ADMIN_USER_EMAILS)
    const userEmail = user.email.toLowerCase()

    const isAllowed = user.role === UserRole.ADMIN
        || allowedIds.has(user.id.toLowerCase())
        || allowedEmails.has(userEmail)

    if (!isAllowed) {
        throw new Error("Forbidden")
    }

    return {
        ...session.user,
        email: user.email,
        role: user.role,
    }
}