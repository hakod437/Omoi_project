import { calculateGlobalScore, getTierFromScore } from '@/lib/scoring';
import { Tier } from '@/types/anime';
import { ServiceResponse } from '@/types/service';

export interface RatingInput {
    userId: string;
    animeId: string;
    malId: number;
    title: string;
    imageUrl?: string;
    genres: string[];
    animTier: Tier;
    scenTier: Tier;
    musicTier: Tier;
    review?: string;
}

export class RatingService {
    static async upsertRating(input: RatingInput): Promise<ServiceResponse<any>> {
        void input
        return { success: false, error: 'Backend disabled (frontend-only mode)' }
    }

    static async getUserRatings(userId: string) {
        void userId
        return []
    }
}
