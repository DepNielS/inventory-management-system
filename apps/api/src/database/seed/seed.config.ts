import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export const seedConfig = {
  databaseUrl: getRequiredEnv('DATABASE_URL'),

  adminPassword: getRequiredEnv('SEED_ADMIN_PASSWORD'),
};