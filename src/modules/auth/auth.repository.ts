import { User } from '../../models/User';

/**
 * Handles all database operations for the auth module.
 * Services never interact with Sequelize models directly.
 */
export class AuthRepository {
  /**
   * Finds a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  /**
   * Finds a user by their primary key
   */
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });
  }

  /**
   * Creates a new user record
   */
  async create(data: {
    username: string;
    email: string;
    password_hash: string;
  }): Promise<User> {
    return User.create(data);
  }
}

export const authRepository = new AuthRepository();