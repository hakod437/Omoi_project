// Services barrel export
export { AnimeService, createAnimeService } from './anime.service';
export { UserService, createUserService } from './user.service';
export { FriendService, createFriendService } from './friend.service';

// Re-export types
export type { AddAnimeInput, UpdateAnimeInput, AnimeListOptions } from './anime.service';
export type { UpdateProfileInput, UserStats } from './user.service';
export type { FriendshipStatus, FriendWithStats } from './friend.service';
