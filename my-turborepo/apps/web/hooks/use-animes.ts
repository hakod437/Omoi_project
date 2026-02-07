'use client';

/**
 * Anime Hooks
 * 
 * Custom hooks for anime data fetching and mutations.
 * 
 * @module hooks/use-animes
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { UserAnimeDetails } from '@/types/database';
import type { AddAnimeRequest, UpdateAnimeRequest } from '@/lib/api';

interface UseAnimesOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface UseAnimesReturn {
    animes: UserAnimeDetails[];
    loading: boolean;
    error: string | null;
    total: number;
    hasMore: boolean;
    refetch: () => Promise<void>;
    addAnime: (data: AddAnimeRequest) => Promise<boolean>;
    updateAnime: (id: string, data: UpdateAnimeRequest) => Promise<boolean>;
    removeAnime: (id: string) => Promise<boolean>;
}

export function useAnimes(options: UseAnimesOptions = {}): UseAnimesReturn {
    const [animes, setAnimes] = useState<UserAnimeDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const { page = 1, limit = 20, sortBy, sortOrder } = options;

    const fetchAnimes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.anime.getList({ page, limit, sortBy, sortOrder });

            if (response.success && response.data) {
                setAnimes(response.data);
                setTotal(response.meta?.total || 0);
                setHasMore(response.meta?.hasMore || false);
            } else {
                setError(response.error?.message || 'Failed to fetch animes');
            }
        } catch (err) {
            setError('An error occurred while fetching animes');
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, sortOrder]);

    useEffect(() => {
        fetchAnimes();
    }, [fetchAnimes]);

    const addAnime = async (data: AddAnimeRequest): Promise<boolean> => {
        try {
            const response = await api.anime.add(data);
            if (response.success) {
                await fetchAnimes();
                return true;
            }
            setError(response.error?.message || 'Failed to add anime');
            return false;
        } catch (err) {
            setError('An error occurred while adding anime');
            return false;
        }
    };

    const updateAnime = async (id: string, data: UpdateAnimeRequest): Promise<boolean> => {
        try {
            const response = await api.anime.update(id, data);
            if (response.success) {
                await fetchAnimes();
                return true;
            }
            setError(response.error?.message || 'Failed to update anime');
            return false;
        } catch (err) {
            setError('An error occurred while updating anime');
            return false;
        }
    };

    const removeAnime = async (id: string): Promise<boolean> => {
        try {
            const response = await api.anime.remove(id);
            if (response.success) {
                setAnimes(prev => prev.filter(a => a.id !== id));
                setTotal(prev => prev - 1);
                return true;
            }
            setError(response.error?.message || 'Failed to remove anime');
            return false;
        } catch (err) {
            setError('An error occurred while removing anime');
            return false;
        }
    };

    return {
        animes,
        loading,
        error,
        total,
        hasMore,
        refetch: fetchAnimes,
        addAnime,
        updateAnime,
        removeAnime,
    };
}

/**
 * Hook for searching animes via Jikan API
 */
export function useAnimeSearch() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (query: string) => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.anime.search(query);
            if (response.success && response.data) {
                setResults(response.data);
            } else {
                setError(response.error?.message || 'Search failed');
            }
        } catch (err) {
            setError('An error occurred during search');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => setResults([]);

    return { results, loading, error, search, clearResults };
}
