/**
 * User Service
 * 
 * Business logic for user-related operations.
 * Handles profile management and user lookups.
 * 
 * @module lib/services/user.service
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database, User, UserUpdate } from '@/types/database';

export interface UpdateProfileInput {
    displayName?: string;
    avatarUrl?: string;
}

export interface UserStats {
    totalAnimes: number;
    averageRating: number;
    averageAnimationRating: number;
    totalFriends: number;
}

/**
 * User Service Class
 * 
 * Provides all user-related operations with proper error handling.
 */
export class UserService {
    constructor(
        private supabase: SupabaseClient<Database>,
        private userId?: string
    ) { }

    /**
     * Get current user's profile
     */
    async getCurrentUser(): Promise<User | null> {
        if (!this.userId) return null;

        const { data, error } = await (this.supabase
            .from('users') as any)
            .select('*')
            .eq('id', this.userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }

        return data;
    }

    /**
     * Get a user by ID (respects RLS - only visible if friend)
     */
    async getUserById(userId: string): Promise<User | null> {
        const { data, error } = await (this.supabase
            .from('users') as any)
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }

        return data;
    }

    /**
     * Search users by email or display name
     */
    async searchUsers(query: string): Promise<User[]> {
        if (!query || query.length < 3) {
            return [];
        }

        const { data, error } = await (this.supabase
            .from('users') as any)
            .select('id, email, display_name, avatar_url')
            .or(`email.ilike.%${query}%,display_name.ilike.%${query}%`)
            .neq('id', this.userId!)
            .limit(10);

        if (error) {
            throw new Error(`Failed to search users: ${error.message}`);
        }

        return (data || []) as User[];
    }

    /**
     * Update current user's profile
     */
    async updateProfile(input: UpdateProfileInput): Promise<User> {
        const updateData: UserUpdate = {};

        if (input.displayName !== undefined) {
            updateData.display_name = input.displayName;
        }
        if (input.avatarUrl !== undefined) {
            updateData.avatar_url = input.avatarUrl;
        }

        const { data, error } = await (this.supabase
            .from('users') as any)
            .update(updateData)
            .eq('id', this.userId!)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }

        return data;
    }

    /**
     * Get user statistics
     */
    async getUserStats(userId?: string): Promise<UserStats> {
        const targetUserId = userId || this.userId!;

        // Get anime stats
        const { data: animeStats } = await (this.supabase
            .from('user_animes') as any)
            .select('user_rating, animation_rating')
            .eq('user_id', targetUserId);

        const animes = animeStats || [];
        const totalAnimes = animes.length;

        const averageRating = totalAnimes > 0
            ? animes.reduce((sum: number, a: any) => sum + (a.user_rating || 0), 0) / totalAnimes
            : 0;

        const averageAnimationRating = totalAnimes > 0
            ? animes.reduce((sum: number, a: any) => sum + (a.animation_rating || 0), 0) / totalAnimes
            : 0;

        // Get friend count
        const { count: friendCount } = await (this.supabase
            .from('friendships') as any)
            .select('*', { count: 'exact', head: true })
            .eq('status', 'accepted')
            .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`);

        return {
            totalAnimes,
            averageRating: Math.round(averageRating * 10) / 10,
            averageAnimationRating: Math.round(averageAnimationRating * 10) / 10,
            totalFriends: friendCount || 0,
        };
    }

    /**
     * Delete current user's account
     * Note: This only deletes the public.users record.
     * The auth.users record must be deleted separately.
     */
    async deleteAccount(): Promise<void> {
        const { error } = await (this.supabase
            .from('users') as any)
            .delete()
            .eq('id', this.userId!);

        if (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    }
}

/**
 * Factory function to create UserService instance
 */
export function createUserService(
    supabase: SupabaseClient<Database>,
    userId?: string
): UserService {
    return new UserService(supabase, userId);
}
