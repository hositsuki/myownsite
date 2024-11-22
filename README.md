# 个人网站

基于 Next.js 13 和 TypeScript 构建的现代响应式个人博客和作品集网站。

## 主要功能

- 🚀 基于 Next.js 13 App Router 构建
- 💎 使用 TypeScript 确保类型安全
- 🎨 采用 Tailwind CSS 构建界面
- 🌟 Framer Motion 动画效果
- 📱 全响应式设计
- 🔒 Express 后端 API
- 🗄️ MongoDB 数据库
- 🔐 JWT 身份认证
- 📝 富文本博客编辑器
- 🖼️ Cloudinary CDN 图片优化
- 🤖 AI 辅助功能（标签生成、阅读时间估算）
- 💾 Redis 缓存优化
- 🔍 全文搜索功能
- 🏷️ 文章标签分类
- 📊 数据分析面板

## 快速开始

### 环境要求

- Node.js 16.8 或更高版本
- MongoDB Atlas 账号
- Cloudinary 账号
- Redis (通过 Upstash)
- OpenAI API 密钥

### 安装步骤

1. 克隆项目:
```bash
git clone <仓库地址>
cd personal-website
```

2. 安装依赖:
```bash
npm install
```

3. 配置环境变量:
```bash
cp .env.example .env
```

4. 启动开发服务器:
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 系统架构

### 整体架构

本项目采用前后端分离的现代Web应用架构，主要包含以下核心部分：

#### 前端架构 (Next.js 13)
- **页面渲染**: 采用Next.js 13的App Router，支持服务端渲染(SSR)和静态生成(SSG)
- **状态管理**: 使用React Context + Hooks管理全局状态
- **UI组件**: 基于Tailwind CSS构建的响应式组件库
- **客户端路由**: Next.js内置路由系统，支持动态路由和中间件
- **API集成**: Axios + SWR用于数据获取和缓存

#### 后端架构 (Express + TypeScript)
- **API服务**: RESTful API，支持版本控制
- **认证系统**: JWT + Redis实现的token管理
- **数据层**: MongoDB作为主数据库，Redis作为缓存层
- **文件存储**: Cloudinary CDN用于图片存储和处理
- **AI服务**: OpenAI API集成，用于内容增强

### 核心服务

#### 1. 认证服务 (AuthService)
- JWT token生成和验证
- 刷新token机制
- 基于Redis的token黑名单
- 角色权限控制

```typescript
interface AuthService {
  login(credentials: LoginDTO): Promise<TokenResponse>;
  refreshToken(token: string): Promise<TokenResponse>;
  validateToken(token: string): Promise<boolean>;
  revokeToken(token: string): Promise<void>;
}
```

#### 2. 图片服务 (ImageService)
- 图片上传和处理
- 自动生成缩略图
- CDN集成
- 图片优化

```typescript
interface ImageService {
  upload(file: File): Promise<ImageResponse>;
  generateThumbnail(url: string): Promise<string>;
  optimize(image: Buffer): Promise<Buffer>;
  delete(publicId: string): Promise<void>;
}
```

#### 3. 博客服务 (BlogService)
- 文章CRUD操作
- 标签管理
- 全文搜索
- AI辅助内容生成

```typescript
interface BlogService {
  createPost(post: PostDTO): Promise<Post>;
  updatePost(id: string, post: PostDTO): Promise<Post>;
  searchPosts(query: SearchQuery): Promise<SearchResult>;
  generateTags(content: string): Promise<string[]>;
}
```

#### 4. 缓存服务 (CacheService)
- API响应缓存
- 用户会话管理
- 热点数据缓存
- 限流控制

```typescript
interface CacheService {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
  rateLimit(key: string, limit: number): Promise<boolean>;
}
```

### 数据流

1. **用户认证流程**:
   ```
   客户端 -> 登录请求 -> AuthService验证 -> 生成JWT -> Redis存储会话 -> 返回Token
   ```

2. **博客发布流程**:
   ```
   编辑文章 -> 上传图片(ImageService) -> AI生成标签 -> 保存到MongoDB -> 更新缓存 -> 返回结果
   ```

3. **搜索流程**:
   ```
   搜索请求 -> 检查缓存 -> MongoDB全文搜索 -> 更新缓存 -> 返回结果
   ```

### 关键技术实现

#### 1. 性能优化
- Redis多级缓存策略
- 图片懒加载和预加载
- API响应压缩
- 静态资源CDN分发

#### 2. 安全措施
- CSRF防护
- XSS过滤
- 请求限流
- 敏感数据加密

#### 3. 监控告警
- 错误日志收集
- 性能指标监控
- 用户行为分析
- 系统健康检查

### 开发指南

#### API开发规范
1. 遵循RESTful设计原则
2. 统一错误处理格式
3. 请求参数验证
4. API文档同步更新

#### 组件开发规范
1. 组件原子化设计
2. Props类型严格定义
3. 样式模块化管理
4. 单元测试覆盖
