import { questionsRepository } from './questions.repository';
import { CreateQuestionDto, CreateAnswerDto } from './questions.schema';
import { NotFoundError, ForbiddenError } from '@shared/errors';
import logger from '@shared/logger';
import { Answer } from '@models/answer.model';
import { Question } from '@models/question.model';
import { User } from '@models/user.model';
import { questionEmitter } from '@shared/events/questionEmitter';
import {
  PaginationOptions,
  PaginatedResult,
  calculatePaginationMeta,
} from '@shared/pagination';

export class QuestionsService {

  async createQuestion(
    userId: number,
    dto: CreateQuestionDto
  ): Promise<Question> {
    const question = await questionsRepository.createQuestion(userId, dto);
    logger.info('Question created', { questionId: question.id, userId });
    return question;
  }

  async getAllQuestions(
    options?: PaginationOptions
  ): Promise<PaginatedResult<Question>> {
    const { page = 1, limit = 10 } = options || {};
    const { rows, count } = await questionsRepository.findAll({ page, limit });
    return {
      data: rows,
      pagination: calculatePaginationMeta(count, page, limit),
    };
  }

  async getQuestionById(id: number): Promise<Question> {
    const question = await questionsRepository.findById(id);
    if (!question) {
      throw new NotFoundError('Question not found');
    }
    return question;
  }

  async createAnswer(
    questionId: number,
    userId: number,
    dto: CreateAnswerDto
  ): Promise<Answer> {
    const question = await questionsRepository.findById(questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    if (question.user_id === userId) {
      throw new ForbiddenError('You cannot answer your own question');
    }

    const answer = await questionsRepository.createAnswer(
      questionId,
      userId,
      dto
    );

    const answerer = await User.findByPk(userId, {
      attributes: ['username'],
    });

    // Emit event — observers handle notification delivery asynchronously
    questionEmitter.emit('answer.posted', {
      answerId: answer.id,
      questionId,
      answererName: answerer?.username ?? 'Someone',
    });

    logger.info('Answer posted', {
      answerId: answer.id,
      questionId,
      userId,
    });

    return answer;
  }

}

export const questionsService = new QuestionsService();