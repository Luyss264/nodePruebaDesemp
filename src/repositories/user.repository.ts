import { User } from "../models/index.js";
import type { UserRole } from "../types/auth.types.js";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UserRepository {
  public async create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email, isActive: true } });
  }

  public async findById(id: number): Promise<User | null> {
    return User.findOne({ where: { id, isActive: true } });
  }

  public async updateRefreshToken(user: User, refreshToken: string | null): Promise<User> {
    return user.update({ refreshToken });
  }
}

export const userRepository = new UserRepository();
