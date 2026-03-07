'use server'

import { ServiceResponse } from '@/types/service';
import { RatingInput } from '@/services/rating.service';

export async function submitRatingAction(
    data: Omit<RatingInput, 'userId'>
): Promise<ServiceResponse<any>> {
    void data
    return { success: false, error: 'Backend disabled (frontend-only mode)' };
}
