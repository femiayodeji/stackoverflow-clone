import { User } from './user.model';
import { Question } from './question.model';
import { Answer } from './answer.model';
import { Subscription } from './subscription.model';
import { Notification } from './notification.model';
import { Vote } from './vote.model';

export function setupAssociations(): void {
  // User <-> Question
  User.hasMany(Question, {
    foreignKey: 'user_id',
    as: 'questions',
  });
  Question.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // User <-> Answer
  User.hasMany(Answer, {
    foreignKey: 'user_id',
    as: 'answers',
  });
  Answer.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // Question <-> Answer
  Question.hasMany(Answer, {
    foreignKey: 'question_id',
    as: 'answers',
  });
  Answer.belongsTo(Question, {
    foreignKey: 'question_id',
    as: 'question',
  });

  // User <-> Subscription
  User.hasMany(Subscription, {
    foreignKey: 'user_id',
    as: 'subscriptions',
  });
  Subscription.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Question <-> Subscription
  Question.hasMany(Subscription, {
    foreignKey: 'question_id',
    as: 'subscriptions',
  });
  Subscription.belongsTo(Question, {
    foreignKey: 'question_id',
    as: 'question',
  });

  // User <-> Notification
  User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
  });
  Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Question <-> Notification
  Question.hasMany(Notification, {
    foreignKey: 'question_id',
    as: 'notifications',
  });
  Notification.belongsTo(Question, {
    foreignKey: 'question_id',
    as: 'question',
  });

  // Vote associations (polymorphic - uses target_id/target_type)
  User.hasMany(Vote, {
    foreignKey: 'user_id',
    as: 'votes',
  });
  Vote.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
}
