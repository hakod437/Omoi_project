export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface Anime {
    id: string;
    malId: number;
    title: string;
    imageUrl?: string;
    genres: string[];
    avgGlobal?: number;
    avgAnimTier?: number;
    avgScenTier?: number;
    avgMusicTier?: number;
    totalRatings: number;
}
