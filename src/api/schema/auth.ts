/**
 * Authentication and Authorization API Schema
 */

import { ApiResponse, Endpoint } from './common';
import { User, UserRole } from '../../types/index';

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface LogoutRequest {
  token: string;
}

// Token payload
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Endpoints
export const AuthEndpoints = {
  login: {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user and get access token',
  } as Endpoint<LoginRequest, ApiResponse<LoginResponse>>,

  logout: {
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Logout user and invalidate token',
  } as Endpoint<LogoutRequest, ApiResponse<{ message: string }>>,

  refreshToken: {
    method: 'POST',
    path: '/api/auth/refresh',
    description: 'Refresh access token',
  } as Endpoint<RefreshTokenRequest, ApiResponse<RefreshTokenResponse>>,

  getCurrentUser: {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current authenticated user',
  } as Endpoint<void, ApiResponse<User>>,
};
