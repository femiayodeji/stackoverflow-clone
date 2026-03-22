import { Request, Response } from 'express';
import { ratingsService } from './ratings.service';
import { catchAsync } from '../../shared/errors';

export class RatingsController {
  /**
   * POST /api/votes
   * Cast or update a vote — protected
   */
  castVote = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await ratingsService.castVote(req.user!.userId, req.body);
    res.status(200).json({ status: 'success', data: result });
  });

  /**
   * DELETE /api/votes
   * Remove a vote — protected
   */
  removeVote = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await ratingsService.removeVote(req.user!.userId, req.body);
    res.status(200).json({ status: 'success', data: result });
  });
}

export const ratingsController = new RatingsController();