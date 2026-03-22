import { QuestionsService } from '../questions.service';
import { questionsRepository } from '../questions.repository';
import { NotFoundError, ForbiddenError } from '@shared/errors';

jest.mock('../questions.repository');

const mockQuestion = {
  id: 1,
  user_id: 1,
  title: 'How does the event loop work?',
  body: 'I want to understand the Node.js event loop in detail.',
};

const mockAnswer = {
  id: 1,
  question_id: 1,
  user_id: 2,
  body: 'The event loop processes the callback queue continuously.',
};

describe('QuestionsService', () => {
  let questionsService: QuestionsService;

  beforeEach(() => {
    questionsService = new QuestionsService();
    jest.clearAllMocks();
  });


  
  describe('createQuestion', () => {
    it('should create and return a new question', async () => {
      (questionsRepository.createQuestion as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await questionsService.createQuestion(1, {
        title: 'How does the event loop work?',
        body: 'I want to understand the Node.js event loop in detail.',
      });

      expect(result).toEqual(mockQuestion);
      expect(questionsRepository.createQuestion).toHaveBeenCalledWith(1, {
        title: 'How does the event loop work?',
        body: 'I want to understand the Node.js event loop in detail.',
      });
    });
  });


  
  describe('getAllQuestions', () => {
    it('should return paginated questions', async () => {
      (questionsRepository.findAll as jest.Mock).mockResolvedValue({
        rows: [mockQuestion],
        count: 1,
      });

      const result = await questionsService.getAllQuestions({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(questionsRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should use default pagination when no options provided', async () => {
      (questionsRepository.findAll as jest.Mock).mockResolvedValue({
        rows: [mockQuestion],
        count: 1,
      });

      const result = await questionsService.getAllQuestions();

      expect(result.data).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });


  
  describe('getQuestionById', () => {
    it('should return a question by id', async () => {
      (questionsRepository.findById as jest.Mock).mockResolvedValue(mockQuestion);

      const result = await questionsService.getQuestionById(1);

      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundError if question does not exist', async () => {
      (questionsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(questionsService.getQuestionById(999)).rejects.toThrow(
        NotFoundError
      );
    });
  });


  
  describe('createAnswer', () => {
    it('should create an answer for a valid question', async () => {
      (questionsRepository.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (questionsRepository.createAnswer as jest.Mock).mockResolvedValue(mockAnswer);

      const result = await questionsService.createAnswer(1, 2, {
        body: 'The event loop processes the callback queue continuously.',
      });

      expect(result).toEqual(mockAnswer);
    });

    it('should throw NotFoundError if question does not exist', async () => {
      (questionsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        questionsService.createAnswer(999, 2, {
          body: 'The event loop processes the callback queue continuously.',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user answers their own question', async () => {
      (questionsRepository.findById as jest.Mock).mockResolvedValue(mockQuestion);

      await expect(
        questionsService.createAnswer(1, 1, {
          body: 'The event loop processes the callback queue continuously.',
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });
});