import { Router } from 'express';
import { subscriptionsController } from './subscriptions.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', protect, subscriptionsController.getNotifications);
router.patch('/:id/read', protect, subscriptionsController.markNotificationAsRead);

export default router;