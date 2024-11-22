import { BaseService } from '../core/BaseService';
import User, { IUser } from '../models/User';
import { generateToken, verifyToken } from '../utils/jwt';
import { AuthError, ValidationError } from '../utils/errors';
import { TokenPayload } from '../types/auth';
import { validateEmail, validatePassword } from '../utils/validation';

export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
  }

  /**
   * 用户注册
   */
  async register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    return await this.wrapDbOperation('register', async () => {
      // 验证必要参数
      this.validateRequiredParams(userData, ['username', 'email', 'password']);

      // 验证邮箱格式
      if (!validateEmail(userData.email)) {
        throw new ValidationError('Invalid email format');
      }

      // 验证密码强度
      if (!validatePassword(userData.password)) {
        throw new ValidationError('Password must be at least 8 characters long and contain at least one number and one letter');
      }

      // 检查用户名和邮箱是否已存在
      const existingUser = await User.findOne({
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });

      if (existingUser) {
        throw new AuthError('Username or email already exists');
      }

      // 创建新用户
      const user = new User({
        ...userData,
        role: 'user',
        isActive: true
      });

      await user.save();

      // 生成 JWT token
      const token = generateToken({
        userId: user._id,
        username: user.username,
        role: user.role
      });

      return { user, token };
    });
  }

  /**
   * 用户登录
   */
  async login(credentials: { email: string; password: string }): Promise<{ user: IUser; token: string }> {
    return await this.wrapDbOperation('login', async () => {
      // 验证必要参数
      this.validateRequiredParams(credentials, ['email', 'password']);

      // 查找用户
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new AuthError('Invalid email or password');
      }

      // 验证密码
      const isValidPassword = await user.comparePassword(credentials.password);
      if (!isValidPassword) {
        throw new AuthError('Invalid email or password');
      }

      // 检查用户状态
      if (!user.isActive) {
        throw new AuthError('Account is disabled');
      }

      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();

      // 生成 JWT token
      const token = generateToken({
        userId: user._id,
        username: user.username,
        role: user.role
      });

      return { user, token };
    });
  }

  /**
   * 验证 token
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    return await this.wrapDbOperation('verifyToken', async () => {
      try {
        const payload = verifyToken(token);
        
        // 验证用户是否存在且处于活动状态
        const user = await User.findById(payload.userId);
        if (!user || !user.isActive) {
          throw new AuthError('User not found or inactive');
        }

        return payload;
      } catch (error) {
        throw new AuthError('Invalid or expired token');
      }
    });
  }

  /**
   * 重置密码请求
   */
  async requestPasswordReset(email: string): Promise<void> {
    await this.wrapDbOperation('requestPasswordReset', async () => {
      // 验证邮箱
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      const user = await User.findOne({ email });
      if (!user) {
        // 出于安全考虑，即使用户不存在也返回成功
        return;
      }

      // 生成重置token
      const resetToken = generateToken({ userId: user._id }, '1h');
      
      // 更新用户的重置token信息
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1小时后过期
      await user.save();

      // TODO: 发送重置密码邮件
    });
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.wrapDbOperation('resetPassword', async () => {
      // 验证密码强度
      if (!validatePassword(newPassword)) {
        throw new ValidationError('Password must be at least 8 characters long and contain at least one number and one letter');
      }

      // 查找具有有效重置token的用户
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new AuthError('Invalid or expired reset token');
      }

      // 更新密码
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    });
  }

  /**
   * 更新用户信息
   */
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser> {
    return await this.wrapDbOperation('updateProfile', async () => {
      // 验证用户ID
      this.validateObjectId(userId);

      // 检查用户是否存在
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthError('User not found');
      }

      // 移除不允许更新的字段
      delete updates.password;
      delete updates.role;
      delete updates.email;
      delete updates.username;

      // 更新用户信息
      Object.assign(user, updates);
      await user.save();

      return user;
    });
  }

  /**
   * 更改密码
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.wrapDbOperation('changePassword', async () => {
      // 验证用户ID
      this.validateObjectId(userId);

      // 验证新密码强度
      if (!validatePassword(newPassword)) {
        throw new ValidationError('New password must be at least 8 characters long and contain at least one number and one letter');
      }

      // 查找用户
      const user = await User.findById(userId);
      if (!user) {
        throw new AuthError('User not found');
      }

      // 验证当前密码
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw new AuthError('Current password is incorrect');
      }

      // 更新密码
      user.password = newPassword;
      await user.save();
    });
  }
}

export default new AuthService();
