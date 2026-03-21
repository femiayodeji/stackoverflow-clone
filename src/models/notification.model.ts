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

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User['id']>;
  declare question_id: ForeignKey<Question['id']>;
  declare message: string;
  declare is_read: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Association mixins
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare getQuestion: BelongsToGetAssociationMixin<Question>;
}

Notification.init(
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
    question_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);