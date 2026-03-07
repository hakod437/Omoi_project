const prisma = new Proxy(
    {},
    {
        get() {
            throw new Error('Backend disabled (frontend-only mode): Prisma is not available')
        },
    }
)

export default prisma
