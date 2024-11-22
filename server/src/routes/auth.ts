import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// 登录验证中间件
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

// Admin login
router.post('/login', loginValidation, validateRequest, AuthController.login);

// 检查管理员状态
router.get('/check-admin', AuthController.checkAdmin);

// 刷新token
router.post('/refresh-token', AuthController.refreshToken);

export default router;
