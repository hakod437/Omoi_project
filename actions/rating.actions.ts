'use server'

import { auth } from '@/lib/auth';
import { RatingService, RatingInput } from '@/services/rating.service';
import { ServiceResponse } from '@/types/service';
import { revalidatePath } from 'next/cache';

export async function submitRatingAction(
    data: Omit<RatingInput, 'userId'>
): Promise<ServiceResponse<any>> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    const result = await RatingService.upsertRating({
        ...data,
        userId: session.user.id
    });

    if (result.success) {
        revalidatePath(`/anime/${data.animeId}`);
        revalidatePath('/dashboard');
    }

    return result;
}
