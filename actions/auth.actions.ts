"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { ServiceResponse } from "@/types/service"

export async function registerWithPhoneAction(formData: FormData): Promise<ServiceResponse<any>> {
    const phoneNumber = formData.get("phoneNumber") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string
    const displayName = formData.get("displayName") as string

    // Validation améliorée
    if (!phoneNumber || !password || !username) {
        return { success: false, error: "Missing required fields: username, phone number, and password are required" }
    }

    if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long" }
    }

    if (username.length < 3) {
        return { success: false, error: "Username must be at least 3 characters long" }
    }

    // Validation simple du format du numéro de téléphone
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        return { success: false, error: "Invalid phone number format" }
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
            if (existingUser.phoneNumber === phoneNumber) {
                return { success: false, error: "Phone number already registered" }
            }
            if (existingUser.username === username) {
                return { success: false, error: "Username already taken" }
            }
            return { success: false, error: "Account already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                phoneNumber,
                password: hashedPassword,
                username,
                displayName: displayName || username, // Utiliser le displayName s'il est fourni, sinon le username
                email: `${username}@phone.placeholder`, // Auth.js often expects an email
            }
        })

        return { success: true, data: { id: user.id, username: user.username, displayName: user.displayName } }
    } catch (error: any) {
        console.error("Registration Error:", error)
        
        // Gérer les erreurs spécifiques de Prisma
        if (error.code === 'P2002') {
            return { success: false, error: "Username or phone number already exists" }
        }
        
        return { success: false, error: "Failed to register user. Please try again." }
    }
}
