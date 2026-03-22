import sequelize from '../config/db';

export default async function globalTeardown() {
  await sequelize.close();
}
