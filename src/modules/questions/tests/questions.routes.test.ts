import request from 'supertest';
import app from '@/app';
import { questionsService } from '../questions.service';
import { NotFoundError, ForbiddenError } from '@shared/errors';
import jwt from 'jsonwebtoken';

jest.mock('../questions.service');

const mockToken = jwt.sign(
  { userId: 1, email: 'alice@example.com' },
  process.env.JWT_SECRET ?? 'test_secret'
);

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

describe('Questions Routes', () => {
  beforeEach(() => jest.clearAllMocks());


  
  describe('GET /api/questions', () => {
    it('should return 200 with paginated questions', async () => {
      const paginatedResult = {
        data: [mockQuestion],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
      (questionsService.getAllQuestions as jest.Mock).mockResolvedValue(paginatedResult);

      const res = await request(app).get('/api/questions');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(1);
    });

    it('should accept page and limit query params', async () => {
      const paginatedResult = {
        data: [mockQuestion],
        pagination: {
          total: 15,
          page: 2,
          limit: 5,
          totalPages: 3,
          hasNextPage: true,
          hasPrevPage: true,
        },
      };
      (questionsService.getAllQuestions as jest.Mock).mockResolvedValue(paginatedResult);

      const res = await request(app).get('/api/questions?page=2&limit=5');

      expect(res.status).toBe(200);
      expect(questionsService.getAllQuestions).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });
  });


  
  describe('GET /api/questions/:id', () => {
    it('should return 200 with a single question', async () => {
      (questionsService.getQuestionById as jest.Mock).mockResolvedValue(mockQuestion);

      const res = await request(app).get('/api/questions/1');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 if question not found', async () => {
      (questionsService.getQuestionById as jest.Mock).mockRejectedValue(
        new NotFoundError('Question not found')
      );

      const res = await request(app).get('/api/questions/999');

      expect(res.status).toBe(404);
    });
  });


  
  describe('POST /api/questions', () => {
    it('should return 201 when authenticated user creates a question', async () => {
      (questionsService.createQuestion as jest.Mock).mockResolvedValue(mockQuestion);

      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'How does the event loop work?',
          body: 'I want to understand the Node.js event loop in detail.',
        });

      expect(res.status).toBe(201);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).post('/api/questions').send({
        title: 'How does the event loop work?',
        body: 'I want to understand the Node.js event loop in detail.',
      });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid body', async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ title: 'short', body: 'too short' });

      expect(res.status).toBe(400);
    });
  });


  
  describe('POST /api/questions/:id/answers', () => {
    it('should return 201 when authenticated user posts an answer', async () => {
      (questionsService.createAnswer as jest.Mock).mockResolvedValue(mockAnswer);

      const res = await request(app)
        .post('/api/questions/1/answers')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ body: 'The event loop processes the callback queue continuously.' });

      expect(res.status).toBe(201);
    });

    it('should return 403 if user answers their own question', async () => {
      (questionsService.createAnswer as jest.Mock).mockRejectedValue(
        new ForbiddenError('You cannot answer your own question')
      );

      const res = await request(app)
        .post('/api/questions/1/answers')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ body: 'The event loop processes the callback queue continuously.' });

      expect(res.status).toBe(403);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app)
        .post('/api/questions/1/answers')
        .send({ body: 'The event loop processes the callback queue continuously.' });

      expect(res.status).toBe(401);
    });
  });
});