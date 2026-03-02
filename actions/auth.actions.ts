"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { ServiceResponse } from "@/types/service"

export async function registerWithPhoneAction(formData: FormData): Promise<ServiceResponse<any>> {
    const phoneNumber = formData.get("phoneNumber") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string
    const displayName = formData.get("displayName") as string

    if (!phoneNumber || !password || !username) {
        return { success: false, error: "Missing required fields" }
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phoneNumber },
                    { username },
                    { email: `${username}@phone.placeholder` } // placeholder email
                ]
            }
        })

        if (existingUser) {
            return { success: false, error: "Username or phone number already in use" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                phoneNumber,
                password: hashedPassword,
                username,
                displayName: displayName || username,
                email: `${username}@phone.placeholder`, // Auth.js often expects an email
            }
        })

        return { success: true, data: { id: user.id, username: user.username } }
    } catch (error: any) {
        console.error("Registration Error:", error)
        return { success: false, error: "Failed to register user" }
    }
}
