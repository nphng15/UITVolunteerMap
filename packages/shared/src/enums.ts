/**
 * Role enum - source of truth for user roles
 * Used by both frontend and backend
 */
export enum RoleEnum {
  ADMIN = 'admin',
  LEADER = 'leader',
  VOLUNTEER = 'volunteer',
}

export type UserRole = `${RoleEnum}`;
