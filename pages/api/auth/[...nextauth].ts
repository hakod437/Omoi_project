import type { NextApiRequest, NextApiResponse } from 'next'

export const authOptions = {} as const

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    void req
    res.status(410).json({ error: 'Backend disabled (frontend-only mode)' })
}
