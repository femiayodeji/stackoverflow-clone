import request from 'supertest';
import app from '@/app';
import { subscriptionsService } from '../subscriptions.service';
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '@shared/errors';
import jwt from 'jsonwebtoken';

jest.mock('../subscriptions.service');

const mockToken = jwt.sign(
  { userId: 1, email: 'alice@example.com' },
  process.env.JWT_SECRET ?? 'test_secret'
);

const mockSubscription = { id: 1, user_id: 1, question_id: 1 };

const mockNotification = {
  id: 1,
  user_id: 1,
  question_id: 1,
  message: 'New answer posted',
  is_read: false,
};

describe('Subscriptions Routes', () => {
  beforeEach(() => jest.clearAllMocks());


  
  describe('POST /api/subscriptions', () => {
    it('should return 201 when subscribed successfully', async () => {
      (subscriptionsService.subscribe as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const res = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ question_id: 1 });

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual(mockSubscription);
    });

    it('should return 409 if already subscribed', async () => {
      (subscriptionsService.subscribe as jest.Mock).mockRejectedValue(
        new ConflictError('You are already subscribed to this question')
      );

      const res = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ question_id: 1 });

      expect(res.status).toBe(409);
    });

    it('should return 403 if subscribing to own question', async () => {
      (subscriptionsService.subscribe as jest.Mock).mockRejectedValue(
        new ForbiddenError('You cannot subscribe to your own question')
      );

      const res = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ question_id: 1 });

      expect(res.status).toBe(403);
    });

    it('should return 404 if question does not exist', async () => {
      (subscriptionsService.subscribe as jest.Mock).mockRejectedValue(
        new NotFoundError('Question not found')
      );

      const res = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ question_id: 999 });

      expect(res.status).toBe(404);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app)
        .post('/api/subscriptions')
        .send({ question_id: 1 });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid body', async () => {
      const res = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ question_id: 'not-a-number' });

      expect(res.status).toBe(400);
    });
  });

  
  describe('DELETE /api/subscriptions/:questionId', () => {
    it('should return 200 when unsubscribed successfully', async () => {
      (subscriptionsService.unsubscribe as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/api/subscriptions/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Unsubscribed successfully');
    });

    it('should return 404 if subscription does not exist', async () => {
      (subscriptionsService.unsubscribe as jest.Mock).mockRejectedValue(
        new NotFoundError('You are not subscribed to this question')
      );

      const res = await request(app)
        .delete('/api/subscriptions/999')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).delete('/api/subscriptions/1');
      expect(res.status).toBe(401);
    });
  });


  
  describe('GET /api/notifications', () => {
    it('should return 200 with all notifications', async () => {
      (subscriptionsService.getNotifications as jest.Mock).mockResolvedValue([
        mockNotification,
      ]);

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.status).toBe(401);
    });
  });


  
  describe('PATCH /api/notifications/:id/read', () => {
    it('should return 200 when notification marked as read', async () => {
      (subscriptionsService.markNotificationAsRead as jest.Mock).mockResolvedValue({
        ...mockNotification,
        is_read: true,
      });

      const res = await request(app)
        .patch('/api/notifications/1/read')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.is_read).toBe(true);
    });

    it('should return 404 if notification does not exist', async () => {
      (subscriptionsService.markNotificationAsRead as jest.Mock).mockRejectedValue(
        new NotFoundError('Notification not found')
      );

      const res = await request(app)
        .patch('/api/notifications/999/read')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 403 if notification belongs to another user', async () => {
      (subscriptionsService.markNotificationAsRead as jest.Mock).mockRejectedValue(
        new ForbiddenError('You cannot update this notification')
      );

      const res = await request(app)
        .patch('/api/notifications/1/read')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).patch('/api/notifications/1/read');
      expect(res.status).toBe(401);
    });
  });
});