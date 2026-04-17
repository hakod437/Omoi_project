import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().min(2).default('15m'),
  JWT_REFRESH_TTL: z.string().min(2).default('30d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  APP_BASE_URL: z.string().url().default('http://localhost:3001'),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnvironment(config: Record<string, unknown>): Environment {
  return envSchema.parse(config);
}