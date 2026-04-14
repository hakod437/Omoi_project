import { describe, it, expect } from 'vitest';
import { UserRole } from './enums';

describe('Shared Enums', () => {
    it('should have correct values', () => {
        expect(UserRole.USER).toBe('USER');
        expect(UserRole.ADMIN).toBe('ADMIN');
    });
});
