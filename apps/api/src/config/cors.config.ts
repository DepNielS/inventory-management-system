import { registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
}));