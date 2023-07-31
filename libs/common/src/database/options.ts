import { DataSourceOptions, LoggerOptions } from 'typeorm';
import { config } from 'dotenv';
config();
function logForDevTest(): Exclude<LoggerOptions, boolean | 'all'> {
  if (['test', 'dev'].includes(process.env.NODE_ENV)) {
    return ['query'];
  }
  return [];
}

export function makeTypeormOptions(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [],
    logging: ['error', 'warn', ...logForDevTest()],
  };
}
