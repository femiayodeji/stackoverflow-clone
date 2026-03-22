import { subscriptionsRepository } from './subscriptions.repository';
import { SubscribeDto } from './subscriptions.schema';
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '@shared/errors';
import { Subscription } from '@models/subscription.model';
import { Notification } from '@models/notification.model';
import { Question } from '@models/question.model';
import logger from '@shared/logger';

export class SubscriptionsService {
  async subscribe(userId: number, dto: SubscribeDto): Promise<Subscription> {
    const { question_id } = dto;

    const question = await Question.findByPk(question_id);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    if (question.user_id === userId) {
      throw new ForbiddenError('You cannot subscribe to your own question');
    }

    const existing = await subscriptionsRepository.findSubscription(
      userId,
      question_id
    );
    if (existing) {
      throw new ConflictError('You are already subscribed to this question');
    }

    const subscription = await subscriptionsRepository.createSubscription(
      userId,
      question_id
    );

    logger.info('User subscribed to question', { userId, questionId: question_id });

    return subscription;
  }

  async unsubscribe(userId: number, questionId: number): Promise<void> {
    const subscription = await subscriptionsRepository.findSubscription(
      userId,
      questionId
    );

    if (!subscription) {
      throw new NotFoundError('You are not subscribed to this question');
    }

    await subscriptionsRepository.deleteSubscription(subscription);

    logger.info('User unsubscribed from question', { userId, questionId });
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return subscriptionsRepository.findNotifications(userId);
  }

  async markNotificationAsRead(
    userId: number,
    notificationId: number
  ): Promise<Notification> {
    const notification = await subscriptionsRepository.findNotificationById(
      notificationId
    );

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenError('You cannot update this notification');
    }

    return subscriptionsRepository.markAsRead(notification);
  }
}

export const subscriptionsService = new SubscriptionsService();