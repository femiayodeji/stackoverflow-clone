import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../shared/errors';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  });
}

export const authController = new AuthController();