import "dotenv/config"
import { registerWithPhoneAction, loginWithPhoneAction } from "../actions/auth.actions"
import prisma from "../lib/prisma"

async function testAuth() {
    console.log("🔒 Starting Exhaustive Auth Testing...")

    const testPhone = "0600000000"
    const testUser = "testpilot"
    const testPass = "password123"

    try {
        // 0. Cleanup
        await prisma.user.deleteMany({ where: { phoneNumber: testPhone } })
        console.log("✅ Cleanup: Done")

        // 1. Successful Registration
        const regForm = new FormData()
        regForm.append('phoneNumber', testPhone)
        regForm.append('username', testUser)
        regForm.append('password', testPass)

        const regRes = await registerWithPhoneAction(regForm)
        if (regRes.success) {
            console.log("✅ Registration: Success")
        } else {
            console.error("❌ Registration: Failed", regRes.error)
        }

        // 2. Duplicate Registration
        const dupRes = await registerWithPhoneAction(regForm)
        if (!dupRes.success && dupRes.error?.includes("already exists")) {
            console.log("✅ Duplicate Prevention: Success")
        } else {
            console.error("❌ Duplicate Prevention: Failed", dupRes.error)
        }

        // 3. Successful Login
        const loginForm = new FormData()
        loginForm.append('phoneNumber', testPhone)
        loginForm.append('password', testPass)

        const loginRes = await loginWithPhoneAction(loginForm)
        if (loginRes.success) {
            console.log("✅ Login (Correct Credentials): Success")
        } else {
            console.error("❌ Login (Correct Credentials): Failed", loginRes.error)
        }

        // 4. Login with Wrong Password
        const wrongPassForm = new FormData()
        wrongPassForm.append('phoneNumber', testPhone)
        wrongPassForm.append('password', 'wrongpass')

        const wrongPassRes = await loginWithPhoneAction(wrongPassForm)
        if (!wrongPassRes.success && wrongPassRes.error?.includes("Invalid password")) {
            console.log("✅ Wrong Password Handling: Success")
        } else {
            console.error("❌ Wrong Password Handling: Failed", wrongPassRes.error)
        }

        // 5. Login with Unknown User
        const unknownUserForm = new FormData()
        unknownUserForm.append('phoneNumber', '0999999999')
        unknownUserForm.append('password', testPass)

        const unknownUserRes = await loginWithPhoneAction(unknownUserForm)
        if (!unknownUserRes.success && unknownUserRes.error?.includes("User not found")) {
            console.log("✅ Unknown User Handling: Success")
        } else {
            console.error("❌ Unknown User Handling: Failed", unknownUserRes.error)
        }

        console.log("\n✨ Auth Testing Complete!")
    } catch (error) {
        console.error("❌ Auth Testing Error:", error)
    } finally {
        await prisma.$disconnect()
    }
}

testAuth()
