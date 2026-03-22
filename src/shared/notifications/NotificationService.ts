import { INotificationChannel, NotificationPayload } from './types';
import logger from '../logger';

export class NotificationService {
  private channels: INotificationChannel[];

  constructor(channels: INotificationChannel[]) {
    this.channels = channels;
  }

  async notify(payload: NotificationPayload): Promise<void> {
    const results = await Promise.allSettled(
      this.channels.map((channel) => channel.send(payload))
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error(`Notification channel ${index} failed`, {
          reason: result.reason,
          userId: payload.user.id,
        });
      }
    });
  }
}