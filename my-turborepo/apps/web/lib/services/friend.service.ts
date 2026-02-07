/**
 * Friend Service
 * 
 * Business logic for friendship-related operations.
 * Handles friend requests, acceptance, and friend list management.
 * 
 * @module lib/services/friend.service
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Friendship, FriendshipInsert, FriendListItem } from '@/types/database';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendWithStats extends FriendListItem {
    animeCount: number;
    commonAnimeCount: number;
}

/**
 * Friend Service Class
 * 
 * Provides all friendship-related operations with proper error handling.
 */
export class FriendService {
    constructor(
        private supabase: SupabaseClient<Database>,
        private userId?: string
    ) { }

    /**
     * Get all friends (accepted friendships)
     */
    async getFriends(): Promise<FriendListItem[]> {
        const { data, error } = await this.supabase
            .from('friend_list')
            .select('*')
            .eq('status', 'accepted');

        if (error) {
            throw new Error(`Failed to fetch friends: ${error.message}`);
        }

        return data || [];
    }

    /**
     * Get friends with anime stats
     */
    async getFriendsWithStats(): Promise<FriendWithStats[]> {
        const friends = await this.getFriends();

        // Get current user's anime list for comparison
        const { data: myAnimes } = await this.supabase
            .from('user_animes')
            .select('mal_id')
            .eq('user_id', this.userId!);

        const myMalIds = new Set((myAnimes || []).map(a => a.mal_id));

        // Fetch stats for each friend
        const friendsWithStats = await Promise.all(
            friends.map(async (friend) => {
                const { data: friendAnimes, count } = await this.supabase
                    .from('user_animes')
                    .select('mal_id', { count: 'exact' })
                    .eq('user_id', friend.friend_id);

                const friendMalIds = (friendAnimes || []).map(a => a.mal_id);
                const commonCount = friendMalIds.filter(id => myMalIds.has(id)).length;

                return {
                    ...friend,
                    animeCount: count || 0,
                    commonAnimeCount: commonCount,
                };
            })
        );

        return friendsWithStats;
    }

    /**
     * Get pending friend requests (received)
     */
    async getPendingRequests(): Promise<FriendListItem[]> {
        // Custom query since friend_list view shows all friendships
        const { data, error } = await this.supabase
            .from('friendships')
            .select(`
        id,
        status,
        created_at,
        requester:users!friendships_requester_id_fkey (
          id,
          display_name,
          avatar_url,
          email
        )
      `)
            .eq('addressee_id', this.userId!)
            .eq('status', 'pending');

        if (error) {
            throw new Error(`Failed to fetch pending requests: ${error.message}`);
        }

        return (data || []).map((item: any) => ({
            friendship_id: item.id,
            status: item.status,
            friendship_created_at: item.created_at,
            friend_id: item.requester.id,
            friend_name: item.requester.display_name,
            friend_avatar: item.requester.avatar_url,
            friend_email: item.requester.email,
        }));
    }

    /**
     * Get sent friend requests (outgoing)
     */
    async getSentRequests(): Promise<FriendListItem[]> {
        const { data, error } = await this.supabase
            .from('friendships')
            .select(`
        id,
        status,
        created_at,
        addressee:users!friendships_addressee_id_fkey (
          id,
          display_name,
          avatar_url,
          email
        )
      `)
            .eq('requester_id', this.userId!)
            .eq('status', 'pending');

        if (error) {
            throw new Error(`Failed to fetch sent requests: ${error.message}`);
        }

        return (data || []).map((item: any) => ({
            friendship_id: item.id,
            status: item.status,
            friendship_created_at: item.created_at,
            friend_id: item.addressee.id,
            friend_name: item.addressee.display_name,
            friend_avatar: item.addressee.avatar_url,
            friend_email: item.addressee.email,
        }));
    }

    /**
     * Send a friend request
     */
    async sendFriendRequest(addresseeId: string): Promise<Friendship> {
        // Check if friendship already exists
        const { data: existing } = await this.supabase
            .from('friendships')
            .select('id, status')
            .or(
                `and(requester_id.eq.${this.userId!},addressee_id.eq.${addresseeId}),` +
                `and(requester_id.eq.${addresseeId},addressee_id.eq.${this.userId!})`
            )
            .single();

        if (existing) {
            if (existing.status === 'accepted') {
                throw new Error('Already friends');
            }
            if (existing.status === 'pending') {
                throw new Error('Friend request already pending');
            }
        }

        const { data, error } = await this.supabase
            .from('friendships')
            .insert({
                requester_id: this.userId!,
                addressee_id: addresseeId,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to send friend request: ${error.message}`);
        }

        return data;
    }

    /**
     * Accept a friend request
     */
    async acceptRequest(friendshipId: string): Promise<Friendship> {
        const { data, error } = await this.supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId)
            .eq('addressee_id', this.userId!) // Only addressee can accept
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to accept friend request: ${error.message}`);
        }

        return data;
    }

    /**
     * Reject a friend request
     */
    async rejectRequest(friendshipId: string): Promise<void> {
        const { error } = await this.supabase
            .from('friendships')
            .update({ status: 'rejected' })
            .eq('id', friendshipId)
            .eq('addressee_id', this.userId!);

        if (error) {
            throw new Error(`Failed to reject friend request: ${error.message}`);
        }
    }

    /**
     * Remove a friend (delete friendship)
     */
    async removeFriend(friendshipId: string): Promise<void> {
        const { error } = await this.supabase
            .from('friendships')
            .delete()
            .eq('id', friendshipId)
            .or(`requester_id.eq.${this.userId!},addressee_id.eq.${this.userId!}`);

        if (error) {
            throw new Error(`Failed to remove friend: ${error.message}`);
        }
    }

    /**
     * Cancel a sent friend request
     */
    async cancelRequest(friendshipId: string): Promise<void> {
        const { error } = await this.supabase
            .from('friendships')
            .delete()
            .eq('id', friendshipId)
            .eq('requester_id', this.userId!)
            .eq('status', 'pending');

        if (error) {
            throw new Error(`Failed to cancel friend request: ${error.message}`);
        }
    }

    /**
     * Check friendship status with another user
     */
    async checkFriendshipStatus(otherUserId: string): Promise<{
        status: FriendshipStatus | null;
        friendshipId: string | null;
        isRequester: boolean;
    }> {
        const { data } = await this.supabase
            .from('friendships')
            .select('id, status, requester_id')
            .or(
                `and(requester_id.eq.${this.userId!},addressee_id.eq.${otherUserId}),` +
                `and(requester_id.eq.${otherUserId},addressee_id.eq.${this.userId!})`
            )
            .single();

        if (!data) {
            return { status: null, friendshipId: null, isRequester: false };
        }

        return {
            status: data.status as FriendshipStatus,
            friendshipId: data.id,
            isRequester: data.requester_id === this.userId,
        };
    }
}

/**
 * Factory function to create FriendService instance
 */
export function createFriendService(
    supabase: SupabaseClient<Database>,
    userId?: string
): FriendService {
    return new FriendService(supabase, userId);
}
