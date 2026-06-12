export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshTtlDays: number;
  };
  storage: {
    dir: string;
  };
  google: {
    clientId: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
    refreshTtlDays: parseInt(process.env.JWT_REFRESH_TTL_DAYS ?? '7', 10),
  },
  storage: {
    dir: process.env.STORAGE_DIR ?? './storage',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  },
});
