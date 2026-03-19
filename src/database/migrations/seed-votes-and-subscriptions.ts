import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const [existingVotes] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM votes`
  ) as any;

  if (existingVotes[0].count === 0) {
    await queryInterface.bulkInsert('votes', [
      // Question votes
      { user_id: 2, target_id: 1, target_type: 'question', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 3, target_id: 1, target_type: 'question', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 4, target_id: 2, target_type: 'question', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 5, target_id: 3, target_type: 'question', value: -1, created_at: new Date(), updated_at: new Date() },
      { user_id: 1, target_id: 4, target_type: 'question', value: 1, created_at: new Date(), updated_at: new Date() },
      // Answer votes
      { user_id: 4, target_id: 1, target_type: 'answer', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 5, target_id: 1, target_type: 'answer', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 1, target_id: 3, target_type: 'answer', value: -1, created_at: new Date(), updated_at: new Date() },
      { user_id: 2, target_id: 5, target_type: 'answer', value: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 3, target_id: 7, target_type: 'answer', value: 1, created_at: new Date(), updated_at: new Date() },
    ]);
  }

  const [existingSubs] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM subscriptions`
  ) as any;

  if (existingSubs[0].count === 0) {
    await queryInterface.bulkInsert('subscriptions', [
      { user_id: 2, question_id: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 3, question_id: 1, created_at: new Date(), updated_at: new Date() },
      { user_id: 1, question_id: 2, created_at: new Date(), updated_at: new Date() },
      { user_id: 4, question_id: 3, created_at: new Date(), updated_at: new Date() },
      { user_id: 5, question_id: 5, created_at: new Date(), updated_at: new Date() },
    ]);
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('subscriptions', {});
  await queryInterface.bulkDelete('votes', {});
}