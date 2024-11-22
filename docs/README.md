# 个人网站技术文档

## 目录

1. [架构概述](#架构概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [核心组件](#核心组件)
5. [API文档](#api文档)
6. [认证](#认证)
7. [数据库架构](#数据库架构)
8. [服务](#服务)
9. [错误处理](#错误处理)
10. [缓存策略](#缓存策略)
11. [开发指南](#开发指南)

## 架构概述

本项目采用现代化的三层架构设计：

1. **前端层**：React + TypeScript实现的单页应用
2. **后端层**：Node.js + Express的RESTful API服务
3. **数据层**：MongoDB数据库 + Redis缓存

### 系统架构图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   前端应用   │ ←→  │   API服务   │ ←→  │    数据库    │
│   (React)   │     │  (Express)  │     │ (MongoDB)   │
└─────────────┘     └─────────────┘     └─────────────┘
                          ↕
                    ┌─────────────┐
                    │    缓存     │
                    │   (Redis)   │
                    └─────────────┘
```

## 技术栈

### 前端
- React 18
- TypeScript 4.x
- TailwindCSS
- React Router
- React Query
- Axios

### 后端
- Node.js 18.x
- Express 4.x
- TypeScript 4.x
- MongoDB + Mongoose
- Redis
- JWT认证

### 开发工具
- ESLint
- Prettier
- Jest
- Docker
- PM2

## 项目结构

```
personal-website/
├── client/                 # 前端代码
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义Hooks
│   │   ├── services/     # API服务
│   │   └── utils/        # 工具函数
│   └── public/           # 静态资源
├── server/                # 后端代码
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务服务
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由定义
│   │   └── utils/        # 工具函数
│   └── tests/            # 测试文件
├── docs/                  # 文档
└── docker/               # Docker配置
```

## 核心组件

### 前端核心组件

1. **布局组件**
   - `Layout`: 页面布局框架
   - `Header`: 页面头部
   - `Footer`: 页面底部
   - `Sidebar`: 侧边栏

2. **功能组件**
   - `PostEditor`: Markdown文章编辑器
   - `ImageUploader`: 图片上传组件
   - `TagManager`: 标签管理
   - `SearchBar`: 搜索组件

### 后端核心组件

1. **控制器**
   - `PostController`: 文章管理
   - `AuthController`: 认证管理
   - `ImageController`: 图片处理
   - `TagController`: 标签管理

2. **服务**
   - `PostService`: 文章服务
   - `AuthService`: 认证服务
   - `ImageService`: 图片服务
   - `CacheService`: 缓存服务

## 认证

系统使用JWT（JSON Web Token）实现认证机制：

1. **认证流程**
   - 用户登录获取访问令牌和刷新令牌
   - 访问令牌用于API请求认证
   - 刷新令牌用于获取新的访问令牌

2. **安全措施**
   - 密码加密存储
   - 令牌过期机制
   - 请求频率限制
   - XSS/CSRF防护

## 缓存策略

使用Redis实现多层缓存策略：

1. **数据缓存**
   - 热门文章缓存
   - 用户会话缓存
   - API响应缓存

2. **缓存策略**
   - LRU缓存淘汰
   - 定时缓存更新
   - 缓存预热机制

## 开发指南

### 环境配置

1. **安装依赖**
```bash
# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd server && npm install
```

2. **环境变量**
```bash
# .env文件配置
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### 开发命令

```bash
# 启动前端开发服务器
npm run dev:client

# 启动后端开发服务器
npm run dev:server

# 运行测试
npm run test

# 构建生产版本
npm run build
```

### 代码规范

1. **命名规范**
   - 使用驼峰命名法
   - 组件使用大写开头
   - 工具函数使用小写开头

2. **文件组织**
   - 按功能模块组织代码
   - 相关文件放在同一目录
   - 测试文件与源文件同目录

3. **注释规范**
   - 使用JSDoc格式注释
   - 复杂逻辑需要详细注释
   - 及时更新注释

### 测试规范

1. **单元测试**
   - 测试覆盖率要求 > 80%
   - 使用Jest + React Testing Library
   - 模拟外部依赖

2. **集成测试**
   - 测试API接口
   - 测试数据流
   - 测试用户场景

### 部署流程

1. **准备工作**
   - 检查环境变量
   - 更新依赖版本
   - 运行测试套件

2. **部署步骤**
   - 构建前端资源
   - 构建后端代码
   - 使用PM2部署

3. **监控维护**
   - 使用PM2监控
   - 日志收集分析
   - 性能监控

## 错误处理

### 错误类型

1. **业务错误**
   - 参数验证错误
   - 权限验证错误
   - 业务逻辑错误

2. **系统错误**
   - 数据库连接错误
   - 网络请求错误
   - 系统资源错误

### 错误处理策略

1. **前端错误处理**
   - 全局错误边界
   - 请求错误处理
   - 友好错误提示

2. **后端错误处理**
   - 统一错误处理中间件
   - 错误日志记录
   - 错误响应格式化
