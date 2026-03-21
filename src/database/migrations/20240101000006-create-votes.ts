import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('votes', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    target_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    target_type: {
      type: DataTypes.ENUM('question', 'answer'),
      allowNull: false,
    },
    value: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1 for upvote, -1 for downvote',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Prevent a user from voting on the same target twice
  await queryInterface.addIndex('votes', ['user_id', 'target_id', 'target_type'], {
    unique: true,
    name: 'unique_user_vote_per_target',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('votes');
}