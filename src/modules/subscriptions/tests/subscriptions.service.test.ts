import { SubscriptionsService } from '../subscriptions.service';
import { subscriptionsRepository } from '../subscriptions.repository';
import { Question } from '../../../models/question.model';
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '../../../shared/errors';

jest.mock('../subscriptions.repository');
jest.mock('../../../models/question.model');

const mockQuestion = { id: 1, user_id: 2 };

const mockSubscription = {
  id: 1,
  user_id: 1,
  question_id: 1,
};

const mockNotification = {
  id: 1,
  user_id: 1,
  question_id: 1,
  message: 'New answer posted',
  is_read: false,
};

describe('SubscriptionsService', () => {
  let subscriptionsService: SubscriptionsService;

  beforeEach(() => {
    subscriptionsService = new SubscriptionsService();
    jest.clearAllMocks();
  });


  
  describe('subscribe', () => {
    it('should create a subscription successfully', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(mockQuestion);
      (subscriptionsRepository.findSubscription as jest.Mock).mockResolvedValue(null);
      (subscriptionsRepository.createSubscription as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const result = await subscriptionsService.subscribe(1, { question_id: 1 });

      expect(result).toEqual(mockSubscription);
      expect(subscriptionsRepository.createSubscription).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundError if question does not exist', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        subscriptionsService.subscribe(1, { question_id: 999 })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user subscribes to own question', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue({
        ...mockQuestion,
        user_id: 1,
      });

      await expect(
        subscriptionsService.subscribe(1, { question_id: 1 })
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw ConflictError if already subscribed', async () => {
      (Question.findByPk as jest.Mock).mockResolvedValue(mockQuestion);
      (subscriptionsRepository.findSubscription as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      await expect(
        subscriptionsService.subscribe(1, { question_id: 1 })
      ).rejects.toThrow(ConflictError);
    });
  });


  
  describe('unsubscribe', () => {
    it('should delete subscription successfully', async () => {
      (subscriptionsRepository.findSubscription as jest.Mock).mockResolvedValue(
        mockSubscription
      );
      (subscriptionsRepository.deleteSubscription as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        subscriptionsService.unsubscribe(1, 1)
      ).resolves.not.toThrow();

      expect(subscriptionsRepository.deleteSubscription).toHaveBeenCalled();
    });

    it('should throw NotFoundError if subscription does not exist', async () => {
      (subscriptionsRepository.findSubscription as jest.Mock).mockResolvedValue(null);

      await expect(
        subscriptionsService.unsubscribe(1, 999)
      ).rejects.toThrow(NotFoundError);
    });
  });


  
  describe('getNotifications', () => {
    it('should return all notifications for a user', async () => {
      (subscriptionsRepository.findNotifications as jest.Mock).mockResolvedValue([
        mockNotification,
      ]);

      const result = await subscriptionsService.getNotifications(1);

      expect(result).toHaveLength(1);
      expect(subscriptionsRepository.findNotifications).toHaveBeenCalledWith(1);
    });
  });


  
  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      (subscriptionsRepository.findNotificationById as jest.Mock).mockResolvedValue(
        mockNotification
      );
      (subscriptionsRepository.markAsRead as jest.Mock).mockResolvedValue({
        ...mockNotification,
        is_read: true,
      });

      const result = await subscriptionsService.markNotificationAsRead(1, 1);

      expect(result.is_read).toBe(true);
    });

    it('should throw NotFoundError if notification does not exist', async () => {
      (subscriptionsRepository.findNotificationById as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        subscriptionsService.markNotificationAsRead(1, 999)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if notification belongs to another user', async () => {
      (subscriptionsRepository.findNotificationById as jest.Mock).mockResolvedValue({
        ...mockNotification,
        user_id: 2,
      });

      await expect(
        subscriptionsService.markNotificationAsRead(1, 1)
      ).rejects.toThrow(ForbiddenError);
    });
  });
});