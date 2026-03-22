import { INotificationChannel, NotificationPayload } from '../types';
import { Notification } from '../../../models/notification.model';
import logger from '../../logger';

export class InAppChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<void> {
    const { user, message, metadata } = payload;

    await Notification.create({
      user_id: user.id,
      question_id: metadata.questionId as number,
      message,
    });

    logger.info('In-app notification saved', {
      userId: user.id,
      questionId: metadata.questionId,
    });
  }
}