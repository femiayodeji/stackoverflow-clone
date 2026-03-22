import { Sequelize } from 'sequelize';
import logger from '../shared/logger';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 3306,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: (sql) => logger.debug(sql),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async (): Promise<void> => {
  await sequelize.authenticate();
  logger.info('Database connection established successfully');
};

export const closeDB = async (): Promise<void> => {
  await sequelize.close();
};

export default sequelize;