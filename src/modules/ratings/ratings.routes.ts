import { Router } from 'express';
import { ratingsController } from './ratings.controller';
import { validate } from '../../middleware/validate.middleware';
import { protect } from '../../middleware/auth.middleware';
import { CastVoteSchema, RemoveVoteSchema } from './ratings.schema';

const router = Router();

router.post('/', protect, validate(CastVoteSchema), ratingsController.castVote);
router.delete('/', protect, validate(RemoveVoteSchema), ratingsController.removeVote);

export default router;