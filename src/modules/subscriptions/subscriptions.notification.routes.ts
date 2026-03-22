import { Router } from 'express';
import { subscriptionsController } from './subscriptions.controller';
import { protect } from '@/middleware/auth.middleware';
import { subscriptionsSSEController } from './subscriptions.sse.controller';

const router = Router();

router.get('/', protect, subscriptionsController.getNotifications);
router.patch('/:id/read', protect, subscriptionsController.markNotificationAsRead);
router.get('/stream', protect, subscriptionsSSEController.stream);

export default router;