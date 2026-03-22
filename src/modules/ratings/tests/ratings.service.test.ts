import { Answer } from '@models/answer.model';
import { Question } from '@models/question.model';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '@shared/errors';
import { ratingsRepository } from '../ratings.repository';
import { RatingsService } from '../ratings.service';

jest.mock('../ratings.repository');
jest.mock('@models/question.model');
jest.mock('@models/answer.model');

const mockQuestion = { id: 1, user_id: 2 };
const mockAnswer = { id: 1, user_id: 2 };
const mockVote = { id: 1, user_id: 1, target_id: 1, target_type: 'question', value: 1 };

describe('RatingsService', () => {
  let ratingsService: RatingsService;

  beforeEach(() => {
    ratingsService = new RatingsService();
    jest.clearAllMocks();
  });


  describe('castVote', () => {
    it('should cast a new upvote on a question', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(mockQuestion);
      (ratingsRepository.findVote as jest.Mock).mockResolvedValue(null);
      (ratingsRepository.createVote as jest.Mock).mockResolvedValue(mockVote);
      (ratingsRepository.getScore as jest.Mock).mockResolvedValue(1);

      const result = await ratingsService.castVote(1, {
        target_id: 1,
        target_type: 'question',
        value: 1,
      });

      expect(result.vote).toEqual(mockVote);
      expect(result.score).toBe(1);
      expect(ratingsRepository.createVote).toHaveBeenCalled();
    });

    it('should update vote if user switches from upvote to downvote', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(mockQuestion);
      (ratingsRepository.findVote as jest.Mock).mockResolvedValue(mockVote);
      (ratingsRepository.updateVote as jest.Mock).mockResolvedValue({
        ...mockVote,
        value: -1,
      });
      (ratingsRepository.getScore as jest.Mock).mockResolvedValue(-1);

      const result = await ratingsService.castVote(1, {
        target_id: 1,
        target_type: 'question',
        value: -1,
      });

      expect(ratingsRepository.updateVote).toHaveBeenCalled();
      expect(result.score).toBe(-1);
    });

    it('should throw BadRequestError if same vote value cast again', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(mockQuestion);
      (ratingsRepository.findVote as jest.Mock).mockResolvedValue(mockVote);

      await expect(
        ratingsService.castVote(1, {
          target_id: 1,
          target_type: 'question',
          value: 1,
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw ForbiddenError if user votes on own question', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue({
        ...mockQuestion,
        user_id: 1,
      });

      await expect(
        ratingsService.castVote(1, {
          target_id: 1,
          target_type: 'question',
          value: 1,
        })
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw NotFoundError if question does not exist', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        ratingsService.castVote(1, {
          target_id: 999,
          target_type: 'question',
          value: 1,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if answer does not exist', async () => {
      (Answer.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        ratingsService.castVote(1, {
          target_id: 999,
          target_type: 'answer',
          value: 1,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user votes on own answer', async () => {
      (Answer.findByPk as jest.Mock).mockResolvedValue({
        ...mockAnswer,
        user_id: 1,
      });

      await expect(
        ratingsService.castVote(1, {
          target_id: 1,
          target_type: 'answer',
          value: 1,
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('removeVote', () => {
    it('should remove an existing vote and return new score', async () => {
      (ratingsRepository.findVote as jest.Mock).mockResolvedValue(mockVote);
      (ratingsRepository.deleteVote as jest.Mock).mockResolvedValue(undefined);
      (ratingsRepository.getScore as jest.Mock).mockResolvedValue(0);

      const result = await ratingsService.removeVote(1, {
        target_id: 1,
        target_type: 'question',
      });

      expect(ratingsRepository.deleteVote).toHaveBeenCalled();
      expect(result.score).toBe(0);
    });

    it('should throw NotFoundError if vote does not exist', async () => {
      (ratingsRepository.findVote as jest.Mock).mockResolvedValue(null);

      await expect(
        ratingsService.removeVote(1, {
          target_id: 1,
          target_type: 'question',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });
});