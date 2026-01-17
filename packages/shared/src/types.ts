// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
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
