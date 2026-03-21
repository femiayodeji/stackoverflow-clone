import { Router } from 'express';
import { questionsController } from './questions.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { protect } from '../../middleware/auth.middleware';
import { CreateQuestionSchema, CreateAnswerSchema } from './questions.schema';

const router = Router();

// Public routes
router.get('/', questionsController.getAllQuestions);
router.get('/:id', questionsController.getQuestionById);

// Protected routes
router.post(
  '/',
  protect,
  validate(CreateQuestionSchema),
  questionsController.createQuestion
);

router.post(
  '/:id/answers',
  protect,
  validate(CreateAnswerSchema),
  questionsController.createAnswer
);

export default router;