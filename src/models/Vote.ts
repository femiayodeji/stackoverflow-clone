import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/db';
import { User } from './User';

export type VoteTargetType = 'question' | 'answer';

export class Vote extends Model<
  InferAttributes<Vote>,
  InferCreationAttributes<Vote>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare target_id: number;
  declare target_type: VoteTargetType;
  declare value: 1 | -1;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'votes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'target_id', 'target_type'],
        name: 'unique_user_vote_per_target',
      },
    ],
  }
);