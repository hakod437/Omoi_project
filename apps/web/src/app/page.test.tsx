import { describe, it, expect } from 'vitest';

describe('Environment', () => {
    it('should be in test mode', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
