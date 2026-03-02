import { searchAnime, getAnimeById } from '@/lib/jikan';
import { ServiceResponse } from '@/types/service';

export class AnimeService {
    static async search(query: string): Promise<ServiceResponse<any[]>> {
        try {
            const results = await searchAnime(query);
            return { success: true, data: results };
        } catch (error: any) {
            console.error('AnimeService.search Error:', error);
            return { success: false, error: 'Failed to search anime' };
        }
    }

    static async getById(id: number): Promise<ServiceResponse<any>> {
        try {
            const anime = await getAnimeById(id);
            if (!anime) return { success: false, error: 'Anime not found' };
            return { success: true, data: anime };
        } catch (error: any) {
            console.error('AnimeService.getById Error:', error);
            return { success: false, error: 'Failed to fetch anime details' };
        }
    }
}
