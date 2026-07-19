import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a valid URL'),
  VITE_APP_NAME: z.string().default('IntelliStudy AI'),
  VITE_APP_TAGLINE: z.string().default('Your AI Learning Coach'),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID is required'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_TAGLINE: import.meta.env.VITE_APP_TAGLINE,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
});

if (!_parsed.success) {
  console.error('❌ Invalid frontend environment variables:');
  console.error(_parsed.error.flatten().fieldErrors);
  throw new Error('Environment variable validation failed');
}

export const env = _parsed.data;
export const isDev = env.VITE_APP_ENV === 'development';
export const isProd = env.VITE_APP_ENV === 'production';
