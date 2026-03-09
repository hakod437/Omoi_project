"use server"

import prisma from "@/lib/prisma"
import { ServiceResponse } from "@/types/service"
import bcrypt from "bcryptjs"

export async function registerWithPhoneAction(formData: FormData): Promise<ServiceResponse<any>> {
    console.log('[🔐 REGISTER] 🚀 Début du processus d\'inscription')
    
    const phoneNumber = formData.get('phoneNumber') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const displayName = formData.get('displayName') as string || username

    console.log('[🔐 REGISTER] 📝 Données reçues:', { 
        phoneNumber: phoneNumber?.substring(0, 8) + '...', 
        username, 
        password: password ? '***' : 'null',
        displayName 
    })

    if (!phoneNumber || !username || !password) {
        console.log('[🔐 REGISTER] ❌ Champs requis manquants')
        return { success: false, error: "Missing required fields" }
    }

    try {
        console.log('[🔐 REGISTER] 🔍 Vérification si l\'utilisateur existe déjà...')
        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phoneNumber },
                    { username },
                    { email: `${phoneNumber}@phone.auth` } // Placeholder email
                ]
            }
        })

        console.log('[🔐 REGISTER] 🔍 Utilisateur existant trouvé:', !!existingUser)
        if (existingUser) {
            console.log('[🔐 REGISTER] ❌ Utilisateur existe déjà')
            return { success: false, error: "User already exists with this phone or username" }
        }

        console.log('[🔐 REGISTER] 🔐 Hashage du mot de passe...')
        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        console.log('[🔐 REGISTER] 👤 Création de l\'utilisateur en base de données...')
        // 3. Create user
        const user = await prisma.user.create({
            data: {
                phoneNumber,
                username,
                password: hashedPassword,
                displayName,
                email: `${phoneNumber}@phone.auth`, // NextAuth often requires email
            }
        })

        console.log('[🔐 REGISTER] ✅ Utilisateur créé avec succès:', user.id, user.username)
        return { success: true, data: { id: user.id, username: user.username } }
    } catch (error) {
        console.error("[🔐 REGISTER] ❌ Erreur lors de l'inscription:", error)
        return { success: false, error: "Failed to register user" }
    }
}

export async function loginWithPhoneAction(formData: FormData): Promise<ServiceResponse<any>> {
    const phoneNumber = formData.get('phoneNumber') as string
    const password = formData.get('password') as string

    if (!phoneNumber || !password) {
        return { success: false, error: "Missing credentials" }
    }

    try {
        const user = await prisma.user.findFirst({
            where: { phoneNumber }
        })

        if (!user || !user.password) {
            return { success: false, error: "User not found" }
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return { success: false, error: "Invalid password" }
        }

        return { success: true, data: { id: user.id, username: user.username } }
    } catch (error) {
        console.error("Login error:", error)
        return { success: false, error: "Failed to login" }
    }
}
