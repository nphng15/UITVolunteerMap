import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoleEnum, AUTH_ERRORS, HTTP_STATUS, type JwtPayload } from '@uit-volunteer-map/shared';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, error: AUTH_ERRORS.TOKEN_REQUIRED });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: AUTH_ERRORS.JWT_SECRET_MISSING });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, error: AUTH_ERRORS.TOKEN_EXPIRED });
    }
    return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, error: AUTH_ERRORS.TOKEN_INVALID });
  }
};

export const requireRole = (roles: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role as RoleEnum)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, error: AUTH_ERRORS.PERMISSION_DENIED });
    }
    next();
  };
};
