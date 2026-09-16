export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const requiredVariables = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  for (const variable of requiredVariables) {
    const value = config[variable];

    if (
      typeof value !== 'string' ||
      value.trim().length === 0
    ) {
      throw new Error(
        `${variable} environment variable is required.`,
      );
    }
  }

  const port = Number(config.PORT ?? 3001);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      'PORT environment variable must be a valid TCP port.',
    );
  }

  return config;
}