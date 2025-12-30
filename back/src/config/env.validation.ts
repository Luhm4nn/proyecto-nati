import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string().required().messages({
    'string.empty': 'DATABASE_URL es requerida',
    'any.required': 'DATABASE_URL es requerida',
  }),

  // JWT
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.empty': 'JWT_SECRET es requerida',
    'string.min': 'JWT_SECRET debe tener al menos 32 caracteres para seguridad',
    'any.required': 'JWT_SECRET es requerida',
  }),
  JWT_EXPIRATION: Joi.string().default('30m'),

  // Server
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // CORS
  CORS_ORIGIN: Joi.string().required().messages({
    'string.empty': 'CORS_ORIGIN es requerida',
    'any.required': 'CORS_ORIGIN es requerida',
  }),

  // Admin Setup
  ADMIN_EMAIL: Joi.string().email().required().messages({
    'string.email': 'ADMIN_EMAIL debe ser un email válido',
    'any.required': 'ADMIN_EMAIL es requerida para scripts de administración',
  }),
  ADMIN_PASSWORD: Joi.string().required().messages({
    'any.required': 'ADMIN_PASSWORD es requerida para scripts de administración',
  }),
  ADMIN_NAME: Joi.string().default('Admin'),
});
