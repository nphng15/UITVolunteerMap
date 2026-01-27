import type { UserRole } from './enums.js';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/**
 * User info returned after login (from Account + Role)
 * This is what gets stored in localStorage and JWT
 */
export interface AuthUser {
  accId: number;
  username: string;
  role: UserRole;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  accId: number;
  role: UserRole;
}

// ============================================
// Entity Types (matching backend entities)
// ============================================

export interface User {
  userId: number;
  fullName: string;
  email: string;
  mssv?: string | null;
  class?: string | null;
  phoneNumber?: string | null;
}

export interface Campaign {
  campaignId: number;
  campaignName: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

export interface Team {
  teamId: number;
  teamName: string;
  description?: string | null;
}

export interface Post {
  postId: number;
  title: string;
  content: string;
  status: string;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  photoId: number;
  title?: string | null;
  imageUrl: string;
  uploadedAt: string;
}

export interface VolunteerLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
