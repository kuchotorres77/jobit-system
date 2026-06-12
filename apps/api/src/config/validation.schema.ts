import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('2h'),
  JWT_REFRESH_TTL_DAYS: Joi.number().integer().min(1).default(7),
  STORAGE_DIR: Joi.string().default('./storage'),
  GOOGLE_CLIENT_ID: Joi.string().allow('').default(''),
});
