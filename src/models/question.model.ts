import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import sequelize from '../config/db';
import { User } from './user.model';

export class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare title: string;
  declare body: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Association mixins
  declare getAnswers: HasManyGetAssociationsMixin<Answer>;
  declare createAnswer: HasManyCreateAssociationMixin<Answer, 'question_id'>;
  declare getAuthor: BelongsToGetAssociationMixin<User>;
}

import { Answer } from './answer.model';

Question.init(
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);