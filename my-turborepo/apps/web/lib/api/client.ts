/**
 * API Client
 * 
 * Typed API client for frontend components.
 * Provides a clean interface to all backend endpoints.
 * 
 * @module lib/api/client
 */

import type { ApiResponse, PaginationParams } from '@/types/api';
import type { UserAnimeDetails, User, FriendListItem } from '@/types/database';
import type { UserStats, FriendWithStats } from '@/lib/services';
import type { JikanAnime } from '@/types';

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();
    return data;
}

// ============================================
// ANIME API
// ============================================

export interface AnimeListResponse {
    data: UserAnimeDetails[];
    meta: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

export interface AddAnimeRequest {
    malId: number;
    userRating: number;
    animationRating: number;
    userDescription?: string;
}

export interface UpdateAnimeRequest {
    userRating?: number;
    animationRating?: number;
    userDescription?: string;
}

export const animeApi = {
    /**
     * Get user's anime list
     */
    async getList(params: PaginationParams = {}): Promise<ApiResponse<UserAnimeDetails[]>> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', String(params.page));
        if (params.limit) searchParams.set('limit', String(params.limit));
        if (params.sortBy) searchParams.set('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

        const query = searchParams.toString();
        return apiFetch<UserAnimeDetails[]>(`/animes${query ? `?${query}` : ''}`);
    },

    /**
     * Get a single anime
     */
    async getById(id: string): Promise<ApiResponse<UserAnimeDetails>> {
        return apiFetch<UserAnimeDetails>(`/animes/${id}`);
    },

    /**
     * Add anime to list
     */
    async add(data: AddAnimeRequest): Promise<ApiResponse<UserAnimeDetails>> {
        return apiFetch<UserAnimeDetails>('/animes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update anime in list
     */
    async update(id: string, data: UpdateAnimeRequest): Promise<ApiResponse<UserAnimeDetails>> {
        return apiFetch<UserAnimeDetails>(`/animes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Remove anime from list
     */
    async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
        return apiFetch<{ deleted: boolean }>(`/animes/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Search animes via Jikan
     */
    async search(query: string): Promise<ApiResponse<JikanAnime[]>> {
        if (query.length < 3) {
            return { success: true, data: [] };
        }
        return apiFetch<JikanAnime[]>(`/animes/search?q=${encodeURIComponent(query)}`);
    },
};

// ============================================
// USER API
// ============================================

export interface UserWithStats extends User {
    stats?: UserStats;
}

export const userApi = {
    /**
     * Get current user profile
     */
    async getProfile(includeStats = false): Promise<ApiResponse<UserWithStats>> {
        return apiFetch<UserWithStats>(`/users/me${includeStats ? '?includeStats=true' : ''}`);
    },

    /**
     * Update profile
     */
    async updateProfile(data: { displayName?: string; avatarUrl?: string }): Promise<ApiResponse<User>> {
        return apiFetch<User>('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Search users
     */
    async search(query: string): Promise<ApiResponse<User[]>> {
        if (query.length < 3) {
            return { success: true, data: [] };
        }
        return apiFetch<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    },
};

// ============================================
// FRIENDS API
// ============================================

export const friendsApi = {
    /**
     * Get friends list
     */
    async getList(includeStats = false): Promise<ApiResponse<FriendListItem[] | FriendWithStats[]>> {
        return apiFetch<FriendListItem[] | FriendWithStats[]>(
            `/friends${includeStats ? '?includeStats=true' : ''}`
        );
    },

    /**
     * Get pending friend requests
     */
    async getPending(): Promise<ApiResponse<FriendListItem[]>> {
        return apiFetch<FriendListItem[]>('/friends?status=pending');
    },

    /**
     * Get sent friend requests
     */
    async getSent(): Promise<ApiResponse<FriendListItem[]>> {
        return apiFetch<FriendListItem[]>('/friends?status=sent');
    },

    /**
     * Send friend request
     */
    async sendRequest(userId: string): Promise<ApiResponse<FriendListItem>> {
        return apiFetch<FriendListItem>('/friends', {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
    },

    /**
     * Accept friend request
     */
    async accept(friendshipId: string): Promise<ApiResponse<FriendListItem>> {
        return apiFetch<FriendListItem>(`/friends/${friendshipId}`, {
            method: 'PUT',
            body: JSON.stringify({ action: 'accept' }),
        });
    },

    /**
     * Reject friend request
     */
    async reject(friendshipId: string): Promise<ApiResponse<{ rejected: boolean }>> {
        return apiFetch<{ rejected: boolean }>(`/friends/${friendshipId}`, {
            method: 'PUT',
            body: JSON.stringify({ action: 'reject' }),
        });
    },

    /**
     * Remove friend
     */
    async remove(friendshipId: string): Promise<ApiResponse<{ deleted: boolean }>> {
        return apiFetch<{ deleted: boolean }>(`/friends/${friendshipId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// COMBINED API CLIENT
// ============================================

export const api = {
    anime: animeApi,
    user: userApi,
    friends: friendsApi,
};

export default api;
