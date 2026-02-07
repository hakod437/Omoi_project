/**
 * Database Types for Supabase
 * 
 * These types are based on the database schema.
 * In production, generate these automatically with:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
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

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    display_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            animes: {
                Row: {
                    mal_id: number;
                    title: string;
                    title_english: string | null;
                    title_japanese: string | null;
                    synopsis: string | null;
                    type: string | null;
                    status: string | null;
                    episodes: number | null;
                    duration: string | null;
                    score: number | null;
                    rank: number | null;
                    popularity: number | null;
                    season: string | null;
                    year: number | null;
                    source: string | null;
                    rating: string | null;
                    images: Json | null;
                    genres: Json;
                    themes: Json;
                    demographics: Json;
                    studios: Json;
                    aired: Json | null;
                    cached_at: string;
                };
                Insert: {
                    mal_id: number;
                    title: string;
                    title_english?: string | null;
                    title_japanese?: string | null;
                    synopsis?: string | null;
                    type?: string | null;
                    status?: string | null;
                    episodes?: number | null;
                    duration?: string | null;
                    score?: number | null;
                    rank?: number | null;
                    popularity?: number | null;
                    season?: string | null;
                    year?: number | null;
                    source?: string | null;
                    rating?: string | null;
                    images?: Json | null;
                    genres?: Json;
                    themes?: Json;
                    demographics?: Json;
                    studios?: Json;
                    aired?: Json | null;
                    cached_at?: string;
                };
                Update: {
                    mal_id?: number;
                    title?: string;
                    title_english?: string | null;
                    title_japanese?: string | null;
                    synopsis?: string | null;
                    type?: string | null;
                    status?: string | null;
                    episodes?: number | null;
                    duration?: string | null;
                    score?: number | null;
                    rank?: number | null;
                    popularity?: number | null;
                    season?: string | null;
                    year?: number | null;
                    source?: string | null;
                    rating?: string | null;
                    images?: Json | null;
                    genres?: Json;
                    themes?: Json;
                    demographics?: Json;
                    studios?: Json;
                    aired?: Json | null;
                    cached_at?: string;
                };
            };
            user_animes: {
                Row: {
                    id: string;
                    user_id: string;
                    mal_id: number;
                    user_rating: number | null;
                    animation_rating: number | null;
                    user_description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    mal_id: number;
                    user_rating?: number | null;
                    animation_rating?: number | null;
                    user_description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    mal_id?: number;
                    user_rating?: number | null;
                    animation_rating?: number | null;
                    user_description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            friendships: {
                Row: {
                    id: string;
                    requester_id: string;
                    addressee_id: string;
                    status: 'pending' | 'accepted' | 'rejected';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    requester_id: string;
                    addressee_id: string;
                    status?: 'pending' | 'accepted' | 'rejected';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    requester_id?: string;
                    addressee_id?: string;
                    status?: 'pending' | 'accepted' | 'rejected';
                    created_at?: string;
                };
            };
        };
        Views: {
            user_anime_details: {
                Row: {
                    id: string;
                    user_id: string;
                    user_rating: number | null;
                    animation_rating: number | null;
                    user_description: string | null;
                    added_at: string;
                    mal_id: number;
                    title: string;
                    title_english: string | null;
                    title_japanese: string | null;
                    synopsis: string | null;
                    type: string | null;
                    status: string | null;
                    episodes: number | null;
                    duration: string | null;
                    score: number | null;
                    rank: number | null;
                    popularity: number | null;
                    season: string | null;
                    year: number | null;
                    source: string | null;
                    rating: string | null;
                    images: Json | null;
                    genres: Json;
                    themes: Json;
                    demographics: Json;
                    studios: Json;
                    aired: Json | null;
                };
            };
            friend_list: {
                Row: {
                    friendship_id: string;
                    status: string;
                    friendship_created_at: string;
                    friend_id: string;
                    friend_name: string | null;
                    friend_avatar: string | null;
                    friend_email: string;
                };
            };
        };
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Anime = Database['public']['Tables']['animes']['Row'];
export type AnimeInsert = Database['public']['Tables']['animes']['Insert'];
export type AnimeUpdate = Database['public']['Tables']['animes']['Update'];

export type UserAnime = Database['public']['Tables']['user_animes']['Row'];
export type UserAnimeInsert = Database['public']['Tables']['user_animes']['Insert'];
export type UserAnimeUpdate = Database['public']['Tables']['user_animes']['Update'];

export type Friendship = Database['public']['Tables']['friendships']['Row'];
export type FriendshipInsert = Database['public']['Tables']['friendships']['Insert'];
export type FriendshipUpdate = Database['public']['Tables']['friendships']['Update'];

export type UserAnimeDetails = Database['public']['Views']['user_anime_details']['Row'];
export type FriendListItem = Database['public']['Views']['friend_list']['Row'];
