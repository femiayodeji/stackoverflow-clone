import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.schema';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import logger from '../../shared/logger';

const SALT_ROUNDS = 10;

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export class AuthService {
  /**
   * Registers a new user.
   * Throws ConflictError if email is already taken.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await authRepository.create({
      username: dto.username,
      email: dto.email,
      password_hash,
    });

    logger.info('New user registered', { userId: user.id, email: user.email });

    const token = this.signToken({ userId: user.id, email: user.email });

    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  /**
   * Logs in an existing user.
   * Throws UnauthorizedError for invalid credentials.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info('User logged in', { userId: user.id });

    const token = this.signToken({ userId: user.id, email: user.email });

    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  /**
   * Signs a JWT token with the user payload
   */
  private signToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();