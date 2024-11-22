# 认证服务文档

## 概述

认证服务（AuthService）负责处理用户认证和授权相关的所有功能，包括用户登录、注册、令牌管理和权限控制。本服务采用JWT（JSON Web Token）实现安全的身份验证机制。

## 功能特性

1. **用户认证**
   - 用户名密码登录
   - 令牌生成和验证
   - 刷新令牌机制

2. **用户管理**
   - 用户注册
   - 密码重置
   - 账户锁定/解锁

3. **权限控制**
   - 基于角色的访问控制
   - 权限验证中间件
   - API访问控制

## 实现细节

### 配置选项

```typescript
interface AuthConfig {
  jwtSecret: string;         // JWT密钥
  tokenExpiration: number;   // 令牌过期时间（秒）
  refreshExpiration: number; // 刷新令牌过期时间（秒）
  saltRounds: number;        // 密码加密轮数
  maxLoginAttempts: number;  // 最大登录尝试次数
  lockTime: number;          // 账户锁定时间（秒）
}
```

### 核心方法

#### 用户登录

```typescript
async function login(username: string, password: string): Promise<AuthResult> {
  // 1. 验证用户名和密码
  const user = await validateCredentials(username, password);
  
  // 2. 检查账户状态
  checkAccountStatus(user);
  
  // 3. 生成令牌
  const tokens = await generateTokens(user);
  
  // 4. 更新用户登录信息
  await updateLoginInfo(user);
  
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: config.tokenExpiration,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };
}
```

#### 令牌验证

```typescript
async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // 验证令牌
    const payload = jwt.verify(token, config.jwtSecret);
    
    // 检查令牌是否被吊销
    await checkTokenRevocation(token);
    
    // 验证用户状态
    await validateUserStatus(payload.userId);
    
    return payload;
  } catch (error) {
    throw new TokenVerificationError(error.message);
  }
}
```

#### 刷新令牌

```typescript
async function refreshToken(refreshToken: string): Promise<AuthResult> {
  // 1. 验证刷新令牌
  const payload = await verifyRefreshToken(refreshToken);
  
  // 2. 获取用户信息
  const user = await getUserById(payload.userId);
  
  // 3. 生成新的访问令牌
  const tokens = await generateTokens(user);
  
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: config.tokenExpiration
  };
}
```

### 错误处理

```typescript
class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// 认证失败错误
class AuthenticationError extends AuthError {
  constructor(message = '用户名或密码错误') {
    super(message, 'AUTHENTICATION_FAILED', 401);
  }
}

// 令牌验证错误
class TokenVerificationError extends AuthError {
  constructor(message = '无效的令牌') {
    super(message, 'TOKEN_VERIFICATION_FAILED', 401);
  }
}

// 账户锁定错误
class AccountLockedError extends AuthError {
  constructor(message = '账户已被锁定') {
    super(message, 'ACCOUNT_LOCKED', 403);
  }
}
```

## 使用示例

### 基本用法

```typescript
const authService = new AuthService(config);

// 用户登录
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleAuthError(error, res);
  }
});

// 验证令牌中间件
const authMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    const payload = await authService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    handleAuthError(error, res);
  }
};
```

### 权限控制

```typescript
// 角色验证中间件
const requireRole = (role: string) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      throw new AuthError('权限不足', 'INSUFFICIENT_PERMISSIONS', 403);
    }
    next();
  };
};

// 使用示例
app.post('/admin/posts', 
  authMiddleware,
  requireRole('admin'),
  createPost
);
```

## 最佳实践

1. **安全性**
   - 使用强密码策略
   - 实现登录尝试限制
   - 安全存储密码和令牌

2. **性能优化**
   - 缓存用户信息
   - 异步处理令牌验证
   - 优化数据库查询

3. **可维护性**
   - 集中式错误处理
   - 完善的日志记录
   - 模块化设计

## 故障排除

### 常见问题

1. **登录失败**
   - 检查用户名密码
   - 验证账户状态
   - 查看登录日志

2. **令牌验证失败**
   - 检查令牌格式
   - 验证密钥配置
   - 确认令牌未过期

3. **权限问题**
   - 检查用户角色
   - 验证权限配置
   - 查看访问日志

### 错误代码

| 代码 | 描述 | 解决方案 |
|------|------|----------|
| AUTHENTICATION_FAILED | 认证失败 | 检查用户名密码 |
| TOKEN_VERIFICATION_FAILED | 令牌验证失败 | 检查令牌有效性 |
| ACCOUNT_LOCKED | 账户锁定 | 等待解锁或联系管理员 |
| INSUFFICIENT_PERMISSIONS | 权限不足 | 检查用户权限 |

## 更新日志

### v1.0.0 (2023-12-01)
- 初始版本发布
- 基本的认证功能
- JWT令牌支持

### v1.1.0 (2023-12-15)
- 添加刷新令牌机制
- 改进错误处理
- 增加登录限制
