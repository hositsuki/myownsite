# API文档

## 概述

本文档详细说明了个人网站后端API的使用方法。所有API都遵循RESTful设计原则，使用JSON格式进行数据交换。

### 基础URL

```
开发环境：http://localhost:3000/api
生产环境：https://api.yourdomain.com/api
```

### 认证

大多数API端点需要JWT令牌认证。在请求头中添加：

```
Authorization: Bearer <your-jwt-token>
```

### 响应格式

所有API响应都遵循统一的格式：

```typescript
interface ApiResponse<T> {
  success: boolean;        // 请求是否成功
  data?: T;               // 响应数据
  message?: string;       // 提示信息
  error?: {
    code: string;         // 错误代码
    message: string;      // 错误信息
    details?: any;        // 详细错误信息
  };
}
```

### 错误代码

| 代码 | 描述 |
|------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求频率超限 |
| 500 | 服务器内部错误 |

## API端点

### 认证相关

#### 登录

```http
POST /api/auth/login
```

请求体：
```json
{
  "username": "admin",
  "password": "your-password"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

#### 刷新令牌

```http
POST /api/auth/refresh
```

请求体：
```json
{
  "refreshToken": "your-refresh-token"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "expiresIn": 3600
  }
}
```

### 文章管理

#### 获取文章列表

```http
GET /api/posts
```

查询参数：
- page: 页码（默认：1）
- limit: 每页数量（默认：10）
- status: 文章状态（可选：draft, published）
- tag: 标签过滤（可选）

响应：
```json
{
  "success": true,
  "data": {
    "posts": [{
      "id": "123",
      "title": "文章标题",
      "excerpt": "文章摘要",
      "date": "2023-01-01T00:00:00Z",
      "tags": ["技术", "编程"],
      "status": "published"
    }],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### 获取单篇文章

```http
GET /api/posts/:slug
```

响应：
```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "文章标题",
    "content": "文章内容...",
    "date": "2023-01-01T00:00:00Z",
    "tags": ["技术", "编程"],
    "status": "published"
  }
}
```

#### 创建文章

```http
POST /api/posts
```

请求体：
```json
{
  "title": "新文章标题",
  "content": "文章内容...",
  "excerpt": "文章摘要",
  "tags": ["技术", "编程"],
  "status": "draft"
}
```

#### 更新文章

```http
PUT /api/posts/:slug
```

请求体：
```json
{
  "title": "更新的标题",
  "content": "更新的内容...",
  "tags": ["技术", "编程"],
  "status": "published"
}
```

#### 删除文章

```http
DELETE /api/posts/:slug
```

### 图片管理

#### 上传图片

```http
POST /api/images/upload
Content-Type: multipart/form-data
```

请求参数：
- file: 图片文件
- type: 图片类型（avatar, post, other）

响应：
```json
{
  "success": true,
  "data": {
    "url": "/images/2023/01/image.jpg",
    "filename": "image.jpg",
    "size": 1024,
    "mimeType": "image/jpeg"
  }
}
```

#### 删除图片

```http
DELETE /api/images/:filename
```

### 标签管理

#### 获取所有标签

```http
GET /api/tags
```

响应：
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "name": "技术",
        "count": 10
      },
      {
        "name": "编程",
        "count": 5
      }
    ]
  }
}
```

## 速率限制

为防止API滥用，实施了以下速率限制：

- 未认证请求：60次/小时
- 已认证请求：1000次/小时
- 登录接口：5次/分钟

超出限制将返回429状态码。

## 最佳实践

1. **错误处理**
   - 始终检查响应的success字段
   - 实现全局错误处理
   - 对特定错误进行特殊处理

2. **性能优化**
   - 使用适当的页码和限制参数
   - 仅请求必要的数据
   - 实现请求缓存

3. **安全建议**
   - 安全存储JWT令牌
   - 及时刷新过期令牌
   - 敏感操作使用HTTPS

## 示例代码

### TypeScript + Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

// 请求拦截器：添加认证头
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理错误
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // 处理认证错误
      return refreshToken().then(newToken => {
        // 使用新令牌重试请求
        return api(error.config);
      });
    }
    return Promise.reject(error);
  }
);

// API方法
export const PostApi = {
  // 获取文章列表
  async getList(params: ListParams) {
    return api.get('/posts', { params });
  },

  // 创建文章
  async create(data: CreatePostData) {
    return api.post('/posts', data);
  },

  // 更新文章
  async update(slug: string, data: UpdatePostData) {
    return api.put(`/posts/${slug}`, data);
  },

  // 删除文章
  async delete(slug: string) {
    return api.delete(`/posts/${slug}`);
  }
};
```

### 文件上传示例

```typescript
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'post');

  try {
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('图片上传失败:', error);
    throw error;
  }
}
```

## 更新日志

### v1.0.0 (2023-12-01)
- 初始API版本发布
- 实现基础的CRUD操作
- 添加JWT认证

### v1.1.0 (2023-12-15)
- 添加图片上传功能
- 优化错误处理
- 添加速率限制
