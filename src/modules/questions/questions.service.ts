import { questionsRepository } from './questions.repository';
import { CreateQuestionDto, CreateAnswerDto } from './questions.schema';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import logger from '../../shared/logger';

export class QuestionsService {

  async createQuestion(
    userId: number,
    dto: CreateQuestionDto
  ): Promise<Question> {
    const question = await questionsRepository.createQuestion(userId, dto);
    logger.info('Question created', { questionId: question.id, userId });
    return question;
  }

  async getAllQuestions(): Promise<Question[]> {
    return questionsRepository.findAll();
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

    logger.info('Answer posted', {
      answerId: answer.id,
      questionId,
      userId,
    });

    return answer;
  }
}

export const questionsService = new QuestionsService();