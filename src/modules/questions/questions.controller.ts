import { Request, Response } from 'express';
import { questionsService } from './questions.service';
import { catchAsync } from '@shared/errors';
import { PaginationSchema } from '@shared/pagination';

export class QuestionsController {
  /**
   * POST /api/questions
   * Creates a new question — protected
   */
  createQuestion = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const question = await questionsService.createQuestion(
      req.user!.userId,
      req.body
    );
    res.status(201).json({ status: 'success', data: question });
  });

  /**
   * GET /api/questions
   * Returns paginated questions — public
   * Query params: page (default 1), limit (default 10, max 100)
   */
  getAllQuestions = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = PaginationSchema.parse(req.query);
    const result = await questionsService.getAllQuestions({ page, limit });
    res.status(200).json({ status: 'success', ...result });
  });

  /**
   * GET /api/questions/:id
   * Returns a single question with its answers — public
   */
  getQuestionById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const question = await questionsService.getQuestionById(
      Number(req.params.id)
    );
    res.status(200).json({ status: 'success', data: question });
  });

  /**
   * POST /api/questions/:id/answers
   * Posts an answer to a question — protected
   */
  createAnswer = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const answer = await questionsService.createAnswer(
      Number(req.params.id),
      req.user!.userId,
      req.body
    );
    res.status(201).json({ status: 'success', data: answer });
  });
}

export const questionsController = new QuestionsController();