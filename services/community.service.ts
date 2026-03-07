import { ServiceResponse } from '@/types/service';

export interface CommunityStats {
  totalReviews: number;
  avgGlobalScore: number;
  avgAnimationScore: number;
  avgScenarioScore: number;
  avgMusicScore: number;
  tierDistribution: {
    S: { count: number; percentage: number };
    A: { count: number; percentage: number };
    B: { count: number; percentage: number };
    C: { count: number; percentage: number };
    D: { count: number; percentage: number };
  };
}

export interface ReviewData {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
  tiers: {
    animation: string;
    scenario: string;
    music: string;
    global: string;
  };
}

export class CommunityService {
  static async getCommunityStats(animeId: string): Promise<ServiceResponse<CommunityStats>> {
    void animeId;
    return {
      success: true,
      data: {
        totalReviews: 0,
        avgGlobalScore: 0,
        avgAnimationScore: 0,
        avgScenarioScore: 0,
        avgMusicScore: 0,
        tierDistribution: {
          S: { count: 0, percentage: 0 },
          A: { count: 0, percentage: 0 },
          B: { count: 0, percentage: 0 },
          C: { count: 0, percentage: 0 },
          D: { count: 0, percentage: 0 },
        },
      },
    };
  }

  static async getRecentReviews(animeId: string, limit: number = 10): Promise<ServiceResponse<ReviewData[]>> {
    void animeId;
    void limit;
    return { success: true, data: [] };
  }

  static async likeReview(reviewId: string, userId: string): Promise<ServiceResponse<any>> {
    void reviewId;
    void userId;
    return { success: false, error: 'Backend disabled (frontend-only mode)' };
  }
}
