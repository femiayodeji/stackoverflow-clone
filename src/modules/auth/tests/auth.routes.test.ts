import request from 'supertest';
import app from '@/app';
import { authService } from '../auth.service';
import { ConflictError, UnauthorizedError } from '@shared/errors';

jest.mock('../auth.service');

const mockAuthResponse = {
  token: 'signed_token',
  user: { id: 1, username: 'alice', email: 'alice@example.com' },
};

describe('Auth Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  // ─── POST /api/auth/register ─────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should return 201 and token on valid registration', async () => {
      (authService.register as jest.Mock).mockResolvedValue(mockAuthResponse);

      const res = await request(app).post('/api/auth/register').send({
        username: 'alice',
        email: 'alice@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.token).toBe('signed_token');
    });

    it('should return 400 for invalid request body', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'al',           // too short
        email: 'not-an-email',
        password: '123',          // too short
      });

      expect(res.status).toBe(400);
    });

    it('should return 409 if email is already registered', async () => {
      (authService.register as jest.Mock).mockRejectedValue(
        new ConflictError('Email is already registered')
      );

      const res = await request(app).post('/api/auth/register').send({
        username: 'alice',
        email: 'alice@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(409);
    });
  });

  // ─── POST /api/auth/login ────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('should return 200 and token on valid login', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const res = await request(app).post('/api/auth/login').send({
        email: 'alice@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedError('Invalid email or password')
      );

      const res = await request(app).post('/api/auth/login').send({
        email: 'alice@example.com',
        password: 'WrongPass1!',
      });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'alice@example.com',
        // password missing
      });

      expect(res.status).toBe(400);
    });
  });
});