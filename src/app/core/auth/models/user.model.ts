export type UserRole = 'profesor' | 'director' | 'directivo';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
