import { Request, Response } from 'express';
import { subscriptionsService } from './subscriptions.service';
import { catchAsync } from '@shared/errors';

export class SubscriptionsController {
  /**
   * POST /api/subscriptions
   * Subscribe to a question — protected
   */
  subscribe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const subscription = await subscriptionsService.subscribe(
      req.user!.userId,
      req.body
    );
    res.status(201).json({ status: 'success', data: subscription });
  });

  /**
   * DELETE /api/subscriptions/:questionId
   * Unsubscribe from a question — protected
   */
  unsubscribe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await subscriptionsService.unsubscribe(
      req.user!.userId,
      Number(req.params.questionId)
    );
    res.status(200).json({ status: 'success', message: 'Unsubscribed successfully' });
  });

  /**
   * GET /api/notifications
   * Get all notifications for authenticated user — protected
   */
  getNotifications = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notifications = await subscriptionsService.getNotifications(
      req.user!.userId
    );
    res.status(200).json({ status: 'success', data: notifications });
  });

  /**
   * PATCH /api/notifications/:id/read
   * Mark a notification as read — protected
   */
  markNotificationAsRead = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notification = await subscriptionsService.markNotificationAsRead(
      req.user!.userId,
      Number(req.params.id)
    );
    res.status(200).json({ status: 'success', data: notification });
  });
}

export const subscriptionsController = new SubscriptionsController();