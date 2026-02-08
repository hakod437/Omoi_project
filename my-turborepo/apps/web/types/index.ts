export interface JikanAnime {
    mal_id: number;
    title: string;
    title_english?: string;
    title_japanese?: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
            small_image_url?: string;
        }
    };
    synopsis?: string;
    type?: string;
    status?: string;
    episodes?: number;
    aired?: {
        from?: string;
        to?: string;
        string?: string;
    };
    season?: string;
    year?: number;
    studios?: Array<{ name: string }>;
    genres?: Array<{ name: string }>;
    themes?: Array<{ name: string }>;
    demographics?: Array<{ name: string }>;
    source?: string;
    duration?: string;
    rating?: string;
    score?: number;
    rank?: number;
    popularity?: number;
}

export interface AnimeWithUserData extends JikanAnime {
    userRating: number;
    animationRating: number;
    userDescription?: string;
    userAnimeId: string;
}

export interface FriendAnime {
    id: string;
    title: string;
    rating: number;
    animationRating: number;
    description: string;
}

export interface Friend {
    id: string;
    name: string;
    animes: FriendAnime[];
}
