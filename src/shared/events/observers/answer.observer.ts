import { questionEmitter } from '../questionEmitter';
import { notificationService } from '../../notifications';
import { Subscription } from '../../../models/subscription.model';
import { User } from '../../../models/user.model';
import logger from '../../logger';

questionEmitter.on('answer.posted', async ({ questionId, answererName }) => {
  try {
    // Fetch all subscribers for this question with their user details
    const subscriptions = await Subscription.findAll({
      where: { question_id: questionId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'username'],
        },
      ],
    });

    if (subscriptions.length === 0) return;

    logger.info('Fanning out answer notifications', {
      questionId,
      subscriberCount: subscriptions.length,
    });

    // Notify each subscriber — fire and forget
    await Promise.allSettled(
      subscriptions.map((subscription) => {
        const user = (subscription as any).user;
        return notificationService.notify({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          message: `${answererName} posted an answer to a question you subscribed to.`,
          metadata: { questionId },
        });
      })
    );
  } catch (err: any) {
    logger.error('Failed to process answer.posted event', {
      error: err.message,
      stack: err.stack,
      questionId,
    });
  }
});