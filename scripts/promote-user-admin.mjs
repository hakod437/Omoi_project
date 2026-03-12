import "dotenv/config"
import { Pool } from "pg"

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
const isSupabaseHost = connectionString && (connectionString.includes("supabase.com") || connectionString.includes("supabase.co"))

const pool = new Pool({
    connectionString,
    ...(isSupabaseHost ? { ssl: { rejectUnauthorized: false } } : {}),
})

async function main() {
    const identifier = process.argv[2]?.trim()

    if (!identifier) {
        console.error("Usage: node scripts/promote-user-admin.mjs <email|username|phoneNumber>")
        process.exit(1)
    }

    const { rows: users } = await pool.query(
        `select id, email, username, role
         from "User"
         where email = $1 or username = $1 or "phoneNumber" = $1
         limit 1`,
        [identifier]
    )

    const user = users[0]

    if (!user) {
        console.error(`User not found for identifier: ${identifier}`)
        process.exit(1)
    }

    const { rows: updatedRows } = await pool.query(
        `update "User"
         set role = 'ADMIN'
         where id = $1
         returning id, email, username, role`,
        [user.id]
    )

    const updated = updatedRows[0]

    console.log("User promoted:", updated)
}

main()
    .catch((error) => {
        console.error("Failed to promote user:", error)
        process.exit(1)
    })
    .finally(async () => {
        await pool.end()
    })