export type UserRole = "ADMIN" | "REQUEST_MANAGER";

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}
