import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import sequelize from '../config/db';
import { User } from './user.model';
import { Question } from './question.model';

export class Answer extends Model<
  InferAttributes<Answer>,
  InferCreationAttributes<Answer>
> {
  declare id: CreationOptional<number>;
  declare question_id: ForeignKey<Question['id']>;
  declare user_id: ForeignKey<User['id']>;
  declare body: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Association mixins
  declare getAuthor: BelongsToGetAssociationMixin<User>;
  declare getQuestion: BelongsToGetAssociationMixin<Question>;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);