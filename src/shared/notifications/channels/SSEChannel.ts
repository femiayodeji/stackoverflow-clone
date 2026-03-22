import { INotificationChannel, NotificationPayload } from '../types';
import { sseRegistry } from '../../sse/SSERegistry';
import logger from '../../logger';

export class SSEChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<void> {
    const { user, message, metadata } = payload;

    if (!sseRegistry.isConnected(user.id)) {
      logger.info('SSE skip — user not connected', { userId: user.id });
      return;
    }

    sseRegistry.send(user.id, 'notification', {
      message,
      questionId: metadata.questionId,
      timestamp: new Date().toISOString(),
    });

    logger.info('SSE notification pushed', {
      userId: user.id,
      questionId: metadata.questionId,
    });
  }
}