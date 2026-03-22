import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { authRepository } from '../auth.repository';
import { ConflictError, UnauthorizedError } from '@shared/errors';

jest.mock('../auth.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUser = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  password_hash: 'hashed_password',
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  // ─── Register ────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should register a new user and return token', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (authRepository.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('signed_token');

      const result = await authService.register({
        username: 'alice',
        email: 'alice@example.com',
        password: 'Password123!',
      });

      expect(result.token).toBe('signed_token');
      expect(result.user.email).toBe('alice@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
    });

    it('should throw ConflictError if email already exists', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          username: 'alice',
          email: 'alice@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  // ─── Login ───────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should login and return token for valid credentials', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('signed_token');

      const result = await authService.login({
        email: 'alice@example.com',
        password: 'Password123!',
      });

      expect(result.token).toBe('signed_token');
      expect(result.user.id).toBe(1);
    });

    it('should throw UnauthorizedError for non-existent email', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'ghost@example.com', password: 'Password123!' })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for wrong password', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'alice@example.com', password: 'WrongPass1!' })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});