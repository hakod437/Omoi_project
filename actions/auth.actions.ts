"use server"

import { ServiceResponse } from "@/types/service"

export async function registerWithPhoneAction(formData: FormData): Promise<ServiceResponse<any>> {
    void formData
    return { success: false, error: 'Backend disabled (frontend-only mode)' }
}
