import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  APP_ENV: string;
  AUTH_PORT: string;
  AUTH_HOST: string;
  AUTH_SERVICE: string;
  PLAN_PORT: string;
  PLAN_HOST: string;
  PLAN_SERVICE: string;
  JWT_SECRET: string;
  NATS_URL: string;
  NATH_SERVICE: string;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  APP_ENV: joi.string().required(),
  PLAN_HOST: joi.string().required(),
  PLAN_PORT: joi.string().required(),
  PLAN_SERVICE: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  NATS_URL: joi.string().required(),
  NATH_SERVICE: joi.string().required(),
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
  plan_service_host: envVars.PLAN_HOST,
  plan_service_port: envVars.PLAN_PORT,
  plan_service_service: envVars.PLAN_SERVICE,
  jwt_secret: envVars.JWT_SECRET,
  nats_server: envVars.NATS_URL,
  nats_service_name: envVars.NATH_SERVICE,
}