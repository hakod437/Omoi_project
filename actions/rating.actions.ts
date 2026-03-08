'use server'

import { ServiceResponse } from '@/types/service';

type RatingInput = {
    animeId: string
    animationScore: number
    scenarioScore: number
    musicScore: number
    review?: string
}

export async function submitRatingAction(
    data: Omit<RatingInput, 'userId'>
): Promise<ServiceResponse<any>> {
    void data
    return { success: false, error: 'Backend disabled (frontend-only mode)' };
}
