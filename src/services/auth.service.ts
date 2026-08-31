import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";
import type { LoginUserDto, RefreshTokenDto, RegisterUserDto } from "../types/auth.types.js";
import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiErrors.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export class AuthService {
  public async register(data: RegisterUserDto): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
  }> {
    const email = data.email.trim().toLowerCase();
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await userRepository.create({
        name: data.name.trim(),
        email,
        password: hashedPassword,
        role: data.role
      });

      return { id: user.id, name: user.name, email: user.email, role: user.role };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ApiError("Email is already registered", 409);
      }

      throw error;
    }
  }

  public async login(data: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmail(data.email.trim().toLowerCase());

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new ApiError("Invalid credentials", 401);
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await userRepository.updateRefreshToken(user, refreshToken);

    return { accessToken, refreshToken };
  }

  public async refresh(data: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(data.refreshToken);
    const user = await userRepository.findById(payload.id);

    if (!user || user.refreshToken !== data.refreshToken) {
      throw new ApiError("Invalid refresh token", 401);
    }

    const newPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(newPayload);
    const refreshToken = generateRefreshToken(newPayload);
    await userRepository.updateRefreshToken(user, refreshToken);

    return { accessToken, refreshToken };
  }

  public async logout(userId: number): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await userRepository.updateRefreshToken(user, null);
  }
}

export const authService = new AuthService();
