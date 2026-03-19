import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Idempotent — skip if users already exist
  const [existing] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM users`
  ) as any;

  if (existing[0].count > 0) return;

  const passwordHash = await bcrypt.hash('Password123!', 10);

  await queryInterface.bulkInsert('users', [
    { username: 'alice', email: 'alice@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
    { username: 'bob', email: 'bob@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
    { username: 'charlie', email: 'charlie@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
    { username: 'diana', email: 'diana@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
    { username: 'eve', email: 'eve@example.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('users', {});
}