import prisma from '@/lib/prisma';
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
    try {
      const ratings = await prisma.rating.findMany({
        where: { animeId },
        include: {
          user: {
            select: {
              username: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      });

      if (ratings.length === 0) {
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

      // Calculate averages
      const avgGlobalScore = ratings.reduce((sum, r) => sum + r.globalScore, 0) / ratings.length;
      
      const TIER_MAP = { S: 10, A: 8, B: 6, C: 4, D: 2 };
      const avgAnimationScore = ratings.reduce((sum, r) => sum + TIER_MAP[r.animTier as keyof typeof TIER_MAP], 0) / ratings.length;
      const avgScenarioScore = ratings.reduce((sum, r) => sum + TIER_MAP[r.scenTier as keyof typeof TIER_MAP], 0) / ratings.length;
      const avgMusicScore = ratings.reduce((sum, r) => sum + TIER_MAP[r.musicTier as keyof typeof TIER_MAP], 0) / ratings.length;

      // Calculate tier distribution
      const tierCounts = {
        S: ratings.filter(r => r.globalTier === 'S').length,
        A: ratings.filter(r => r.globalTier === 'A').length,
        B: ratings.filter(r => r.globalTier === 'B').length,
        C: ratings.filter(r => r.globalTier === 'C').length,
        D: ratings.filter(r => r.globalTier === 'D').length,
      };

      const total = ratings.length;
      const tierDistribution = {
        S: { count: tierCounts.S, percentage: Math.round((tierCounts.S / total) * 100) },
        A: { count: tierCounts.A, percentage: Math.round((tierCounts.A / total) * 100) },
        B: { count: tierCounts.B, percentage: Math.round((tierCounts.B / total) * 100) },
        C: { count: tierCounts.C, percentage: Math.round((tierCounts.C / total) * 100) },
        D: { count: tierCounts.D, percentage: Math.round((tierCounts.D / total) * 100) },
      };

      return {
        success: true,
        data: {
          totalReviews: ratings.length,
          avgGlobalScore: Math.round(avgGlobalScore * 10) / 10,
          avgAnimationScore: Math.round(avgAnimationScore * 10) / 10,
          avgScenarioScore: Math.round(avgScenarioScore * 10) / 10,
          avgMusicScore: Math.round(avgMusicScore * 10) / 10,
          tierDistribution,
        },
      };
    } catch (error: any) {
      console.error('CommunityService.getCommunityStats Error:', error);
      return { success: false, error: 'Failed to fetch community stats' };
    }
  }

  static async getRecentReviews(animeId: string, limit: number = 10): Promise<ServiceResponse<ReviewData[]>> {
    try {
      const reviews = await prisma.review.findMany({
        where: { animeId },
        include: {
          user: {
            select: {
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          rating: {
            select: {
              animTier: true,
              scenTier: true,
              musicTier: true,
              globalTier: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      const reviewData: ReviewData[] = reviews.map(review => ({
        id: review.id,
        username: review.user.displayName || review.user.username,
        avatar: review.user.avatar || undefined,
        content: review.content,
        likes: review.likes,
        createdAt: review.createdAt,
        tiers: {
          animation: review.rating.animTier,
          scenario: review.rating.scenTier,
          music: review.rating.musicTier,
          global: review.rating.globalTier,
        },
      }));

      return { success: true, data: reviewData };
    } catch (error: any) {
      console.error('CommunityService.getRecentReviews Error:', error);
      return { success: false, error: 'Failed to fetch recent reviews' };
    }
  }

  static async likeReview(reviewId: string, userId: string): Promise<ServiceResponse<any>> {
    try {
      // This is a simplified version - in production you'd want to prevent duplicate likes
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return { success: true, data: review };
    } catch (error: any) {
      console.error('CommunityService.likeReview Error:', error);
      return { success: false, error: 'Failed to like review' };
    }
  }
}
