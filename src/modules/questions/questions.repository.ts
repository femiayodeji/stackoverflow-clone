import { Answer } from '@models/answer.model';
import { Question } from '@models/question.model';
import { User } from '@models/user.model';
import { CreateQuestionDto, CreateAnswerDto } from './questions.schema';
import { PaginationOptions, calculateOffset } from '@shared/pagination';

export class QuestionsRepository {

  async createQuestion(
    userId: number,
    dto: CreateQuestionDto
  ): Promise<Question> {
    return Question.create({ user_id: userId, ...dto });
  }

  async findAll(
    options?: PaginationOptions
  ): Promise<{ rows: Question[]; count: number }> {
    const { page = 1, limit = 10 } = options || {};
    const offset = calculateOffset(page, limit);

    return Question.findAndCountAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
  }

  async findById(id: number): Promise<Question | null> {
    return Question.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
        {
          model: Answer,
          as: 'answers',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username'],
            },
          ],
          order: [['created_at', 'ASC']],
        },
      ],
    });
  }

  async createAnswer(
    questionId: number,
    userId: number,
    dto: CreateAnswerDto
  ): Promise<Answer> {
    return Answer.create({ question_id: questionId, user_id: userId, ...dto });
  }

  async findAnswerById(id: number): Promise<Answer | null> {
    return Answer.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
      ],
    });
  }
}

export const questionsRepository = new QuestionsRepository();