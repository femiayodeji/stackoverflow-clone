import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { RegisterSchema, LoginSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);

export default router;