import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../core/ApiError';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(err => {
        if ('msg' in err) {
          return err.msg;
        }
        return '验证错误';
      });
      next(new ApiError(400, '请求验证失败', messages));
      return;
    }
    next();
  } catch (error) {
    next(new ApiError(500, '请求验证过程中发生错误'));
  }
};
