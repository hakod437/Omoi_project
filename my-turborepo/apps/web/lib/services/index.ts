/**
 * Services Index
 * 
 * Exports all services and their types
 * 
 * @module lib/services/index
 */

// Service exports
export * from './anime.service';
export * from './user.service';
export * from './friend.service';

// Type exports
export type { 
    AddAnimeInput, 
    UpdateAnimeInput, 
    AnimeListOptions 
} from './anime.service';

export type { 
    CreateUserData, 
    UpdateUserData 
} from './user.service';
