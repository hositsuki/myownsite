import { Request, Response } from 'express';
import { BaseController } from '../core/BaseController';
import AuthService from '../services/AuthService';
import { LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, PasswordChange } from '../types/auth';

export class AuthController extends BaseController {
  constructor() {
    super('AuthController');
  }

  /**
   * 用户注册
   */
  register = this.wrapAsync(async (req: Request, res: Response) => {
    const registerData: RegisterData = req.body;
    const { user, token } = await AuthService.register(registerData);
    
    this.sendSuccess(res, {
      message: 'Registration successful',
      data: { user, token }
    });
  });

  /**
   * 用户登录
   */
  login = this.wrapAsync(async (req: Request, res: Response) => {
    const credentials: LoginCredentials = req.body;
    const { user, token } = await AuthService.login(credentials);
    
    this.sendSuccess(res, {
      message: 'Login successful',
      data: { user, token }
    });
  });

  /**
   * 请求重置密码
   */
  requestPasswordReset = this.wrapAsync(async (req: Request, res: Response) => {
    const { email }: PasswordResetRequest = req.body;
    await AuthService.requestPasswordReset(email);
    
    this.sendSuccess(res, {
      message: 'Password reset instructions have been sent to your email'
    });
  });

  /**
   * 重置密码
   */
  resetPassword = this.wrapAsync(async (req: Request, res: Response) => {
    const { token, newPassword }: PasswordResetConfirm = req.body;
    await AuthService.resetPassword(token, newPassword);
    
    this.sendSuccess(res, {
      message: 'Password has been reset successfully'
    });
  });

  /**
   * 更改密码
   */
  changePassword = this.wrapAsync(async (req: Request, res: Response) => {
    const { currentPassword, newPassword }: PasswordChange = req.body;
    const userId = req.user?._id.toString();
    
    this.validateRequiredParams({ userId }, ['userId']);
    
    await AuthService.changePassword(userId, currentPassword, newPassword);
    
    this.sendSuccess(res, {
      message: 'Password changed successfully'
    });
  });

  /**
   * 获取当前用户信息
   */
  getCurrentUser = this.wrapAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    this.validateRequiredParams({ userId }, ['userId']);
    
    const user = await AuthService.getUser(userId);
    
    this.sendSuccess(res, {
      data: { user }
    });
  });

  /**
   * 更新用户资料
   */
  updateProfile = this.wrapAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    this.validateRequiredParams({ userId }, ['userId']);
    
    const user = await AuthService.updateProfile(userId, req.body);
    
    this.sendSuccess(res, {
      message: 'Profile updated successfully',
      data: { user }
    });
  });

  /**
   * 验证 token
   */
  verifyToken = this.wrapAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    this.validateRequiredParams({ token }, ['token']);
    
    const payload = await AuthService.verifyToken(token);
    
    this.sendSuccess(res, {
      data: { payload }
    });
  });

  /**
   * 退出登录
   */
  logout = this.wrapAsync(async (_req: Request, res: Response) => {
    // 在客户端处理 token 的清除
    this.sendSuccess(res, {
      message: 'Logged out successfully'
    });
  });
}

export default new AuthController();
