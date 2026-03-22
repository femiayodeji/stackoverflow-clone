import { Router } from 'express';
import { subscriptionsController } from './subscriptions.controller';
import { validate } from '../../middleware/validate.middleware';
import { protect } from '../../middleware/auth.middleware';
import { SubscribeSchema } from './subscriptions.schema';

const router = Router();

router.post(
  '/',
  protect,
  validate(SubscribeSchema),
  subscriptionsController.subscribe
);

router.delete(
  '/:questionId',
  protect,
  subscriptionsController.unsubscribe
);

export default router;