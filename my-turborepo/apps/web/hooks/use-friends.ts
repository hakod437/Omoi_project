'use client';

/**
 * Friends Hooks
 * 
 * Custom hooks for friends data fetching and mutations.
 * 
 * @module hooks/use-friends
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { FriendListItem } from '@/types/database';
import type { FriendWithStats } from '@/lib/services';

interface UseFriendsReturn {
    friends: FriendWithStats[];
    pendingRequests: FriendListItem[];
    sentRequests: FriendListItem[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    sendRequest: (userId: string) => Promise<boolean>;
    acceptRequest: (friendshipId: string) => Promise<boolean>;
    rejectRequest: (friendshipId: string) => Promise<boolean>;
    removeFriend: (friendshipId: string) => Promise<boolean>;
}

export function useFriends(): UseFriendsReturn {
    const [friends, setFriends] = useState<FriendWithStats[]>([]);
    const [pendingRequests, setPendingRequests] = useState<FriendListItem[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [friendsRes, pendingRes, sentRes] = await Promise.all([
                api.friends.getList(true),
                api.friends.getPending(),
                api.friends.getSent(),
            ]);

            if (friendsRes.success && friendsRes.data) {
                setFriends(friendsRes.data as FriendWithStats[]);
            }
            if (pendingRes.success && pendingRes.data) {
                setPendingRequests(pendingRes.data);
            }
            if (sentRes.success && sentRes.data) {
                setSentRequests(sentRes.data);
            }
        } catch (err) {
            setError('Failed to fetch friends data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const sendRequest = async (userId: string): Promise<boolean> => {
        try {
            const response = await api.friends.sendRequest(userId);
            if (response.success) {
                await fetchAll();
                return true;
            }
            setError(response.error?.message || 'Failed to send friend request');
            return false;
        } catch (err) {
            setError('An error occurred');
            return false;
        }
    };

    const acceptRequest = async (friendshipId: string): Promise<boolean> => {
        try {
            const response = await api.friends.accept(friendshipId);
            if (response.success) {
                await fetchAll();
                return true;
            }
            setError(response.error?.message || 'Failed to accept request');
            return false;
        } catch (err) {
            setError('An error occurred');
            return false;
        }
    };

    const rejectRequest = async (friendshipId: string): Promise<boolean> => {
        try {
            const response = await api.friends.reject(friendshipId);
            if (response.success) {
                setPendingRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
                return true;
            }
            setError(response.error?.message || 'Failed to reject request');
            return false;
        } catch (err) {
            setError('An error occurred');
            return false;
        }
    };

    const removeFriend = async (friendshipId: string): Promise<boolean> => {
        try {
            const response = await api.friends.remove(friendshipId);
            if (response.success) {
                setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId));
                return true;
            }
            setError(response.error?.message || 'Failed to remove friend');
            return false;
        } catch (err) {
            setError('An error occurred');
            return false;
        }
    };

    return {
        friends,
        pendingRequests,
        sentRequests,
        loading,
        error,
        refetch: fetchAll,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,
    };
}
