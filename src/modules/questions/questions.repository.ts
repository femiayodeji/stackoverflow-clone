import { Question } from '../../models/Question';
import { Answer } from '../../models/Answer';
import { User } from '../../models/User';
import { CreateQuestionDto, CreateAnswerDto } from './questions.schema';

export class QuestionsRepository {

  async createQuestion(
    userId: number,
    dto: CreateQuestionDto
  ): Promise<Question> {
    return Question.create({ user_id: userId, ...dto });
  }

  async findAll(): Promise<Question[]> {
    return Question.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
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