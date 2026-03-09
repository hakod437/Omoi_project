/**
 * Database Types for Prisma
 * 
 * These types should be generated from Prisma schema with:
 * npx prisma generate
 * 
 * @module types/database
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// TODO: Generate types from Prisma schema
// For now, using basic types
export interface User {
    id: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Anime {
    malId: number;
    title: string;
    // TODO: Add other anime fields based on Prisma schema
}

export interface UserAnimeRating {
    id: string;
    userId: string;
    animeId: string;
    malId?: number; // For compatibility
    animTier: 'S' | 'A' | 'B' | 'C' | 'D';
    scenTier: 'S' | 'A' | 'B' | 'C' | 'D';
    musicTier: 'S' | 'A' | 'B' | 'C' | 'D';
    globalScore: number;
    globalTier: 'S' | 'A' | 'B' | 'C' | 'D';
    createdAt: Date;
    updatedAt: Date;
}

export interface UserAnimeDetails extends UserAnimeRating {
    anime: Anime;
}

export interface FriendRequest {
    id: string;
    requesterId: string;
    addresseeId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

export interface Friendship {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
}

export interface FriendListItem extends User {
    friendshipStatus?: 'pending' | 'accepted' | 'none';
    friendshipId?: string;
}

export type Database = {
    users: User;
    animes: Anime;
    user_anime_ratings: UserAnimeRating;
    friend_requests: FriendRequest;
    friendships: Friendship;
};
