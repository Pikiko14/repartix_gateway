import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  APP_ENV: string;
  JWT_SECRET: string;
  NATS_URL: string;
  NATH_SERVICE: string;
  LIMIT: number;
  TTL: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  APP_ENV: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  NATS_URL: joi.string().required(),
  NATH_SERVICE: joi.string().required(),
  LIMIT: joi.number().required(),
  TTL: joi.number().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate({ 
  ...process.env,
});


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  app_env: envVars.APP_ENV,
  jwt_secret: envVars.JWT_SECRET,
  nats_server: envVars.NATS_URL,
  nats_service_name: envVars.NATH_SERVICE,
  limit: envVars.LIMIT,
  ttl: envVars.TTL,
}