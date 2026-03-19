import dotenv from 'dotenv';
dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'mysql';
  logging: boolean;
}

interface Config {
  development: DbConfig;
  test: DbConfig;
  production: DbConfig;
}

const config: Config = {
  development: {
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'stackoverflow_clone',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 3306,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'stackoverflow_clone_test',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 3306,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
    host: process.env.DB_HOST ?? '',
    port: Number(process.env.DB_PORT) ?? 3306,
    dialect: 'mysql',
    logging: false,
  },
};

export default config;