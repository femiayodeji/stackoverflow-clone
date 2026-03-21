import { User } from '../../models/User';

export class AuthRepository {

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });
  }

  async create(data: {
    username: string;
    email: string;
    password_hash: string;
  }): Promise<User> {
    return User.create(data);
  }
}

export const authRepository = new AuthRepository();