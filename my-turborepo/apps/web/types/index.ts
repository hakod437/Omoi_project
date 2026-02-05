import { JikanAnime } from '@/app/components/anime-search';

export interface AnimeWithUserData extends JikanAnime {
    userRating: number;
    animationRating: number;
    userDescription: string;
    userAnimeId: string;
}

export interface FriendAnime {
    id: string;
    name: string;
    rating: number; // Global rating
    animationRating: number;
    description: string;
}

export interface Friend {
    id: string;
    name: string;
    animes: FriendAnime[];
}
