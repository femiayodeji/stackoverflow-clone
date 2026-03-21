import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../shared/errors';

export class AuthController {
   /**
   * POST /api/auth/register
   * Registers a new user — public
   */  
  register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  /**
   * POST /api/auth/login
   * Logs in a user — public
   */
  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  });
}

export const authController = new AuthController();