import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../core/ApiError';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('认证令牌缺失');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('认证失败:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('无效的认证令牌'));
    } else if (error instanceof Error) {
      next(new UnauthorizedError(error.message));
    } else {
      next(new UnauthorizedError('认证失败'));
    }
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      throw new UnauthorizedError('需要管理员权限');
    }
    next();
  } catch (error) {
    logger.error('权限验证失败:', error);
    if (error instanceof Error) {
      next(new UnauthorizedError(error.message));
    } else {
      next(new UnauthorizedError('权限验证失败'));
    }
  }
};
