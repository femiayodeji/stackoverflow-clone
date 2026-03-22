import { INotificationChannel, NotificationPayload } from '../types';
import { transporter } from '../../../config/mailer';
import logger from '../../logger';

export class EmailChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<void> {
    const { user, message, metadata } = payload;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Your subscribed question has a new answer',
      html: `
        <h2>Hi ${user.username},</h2>
        <p>${message}</p>
        <p>
          <a href="${process.env.APP_URL}/questions/${metadata.questionId}">
            View the answer
          </a>
        </p>
      `,
    });

    logger.info('Email notification sent', {
      userId: user.id,
      email: user.email,
      questionId: metadata.questionId,
    });
  }
}