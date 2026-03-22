import { Subscription } from '@models/subscription.model';
import { Notification } from '@models/notification.model';
import { Question } from '@models/question.model';

export class SubscriptionsRepository {
  async findSubscription(
    userId: number,
    questionId: number
  ): Promise<Subscription | null> {
    return Subscription.findOne({
      where: { user_id: userId, question_id: questionId },
    });
  }

  async createSubscription(
    userId: number,
    questionId: number
  ): Promise<Subscription> {
    return Subscription.create({ user_id: userId, question_id: questionId });
  }

  async deleteSubscription(subscription: Subscription): Promise<void> {
    await subscription.destroy();
  }

  async findNotifications(userId: number): Promise<Notification[]> {
    return Notification.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'title'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findNotificationById(id: number): Promise<Notification | null> {
    return Notification.findByPk(id);
  }

  async markAsRead(notification: Notification): Promise<Notification> {
    return notification.update({ is_read: true });
  }
}

export const subscriptionsRepository = new SubscriptionsRepository();