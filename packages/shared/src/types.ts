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

export interface AuthUser {
  accId: number;
  userId?: number | null;
  username: string;
  role: UserRole;
}

export interface JwtPayload {
  accId: number;
  role: UserRole;
}

// ============================================
// Campaign Types
// ============================================
export interface CreateCampaignInput {
  campaignName: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  latitude?: number | null;
  longitude?: number | null;
  checkInRadius?: number | null;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

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
  latitude?: number | null;
  longitude?: number | null;
  checkInRadius?: number | null;
}

export interface Team {
  teamId: number;
  teamName: string;
  description?: string | null;
  imageUrl?: string | null;
  attachments?: Attachment[];
}

export interface Post {
  postId: number;
  title: string;
  content: string;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: PostThumbnail | null;
  photos?: Photo[];
  team?: PostTeamRef | null;
  author?: PostAuthorRef | null;
}

export interface PostThumbnail {
  photoId: number;
  imageUrl: string;
  title?: string | null;
}

export interface PostTeamRef {
  teamId: number;
  teamName: string;
}

export interface PostAuthorRef {
  userId: number;
  fullName: string;
}

export interface Photo {
  photoId: number;
  title?: string | null;
  imageUrl: string;
  uploadedAt: string;
  isFirstImage?: number;
}

export interface Attachment {
  attachmentId: number;
  imageUrl: string;
  uploadedAt: string;
  position?: number | null;
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

// ============================================
// Check-in Types
// ============================================

export interface CheckInRequest {
  campaignId: number;
  latitude: number;
  longitude: number;
}

export interface CheckInResponse {
  checkInId: number;
  campaignId: number;
  accId: number;
  latitude: number;
  longitude: number;
  distance: number;
  checkedInAt: string;
}

export interface CheckInRecord {
  checkInId: number;
  campaignId: number;
  accId: number;
  latitude: number;
  longitude: number;
  distance: number;
  checkedInAt: string;
  campaign?: Campaign;
}
