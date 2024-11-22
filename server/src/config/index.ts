// 站点配置
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
export const SITE_TITLE = process.env.SITE_TITLE || 'Yuki的个人网站';
export const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION || '分享技术、生活和思考';
export const AUTHOR_NAME = process.env.AUTHOR_NAME || 'Yuki';
export const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL || 'contact@example.com';

// API 配置
export const API_PREFIX = '/api';
export const API_VERSION = 'v1';

// 缓存配置
export const CACHE_TTL = 60 * 60 * 1000; // 1小时
export const MAX_CACHE_ITEMS = 100;

// 分页配置
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// 上传配置
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// 认证配置
export const JWT_EXPIRES_IN = '7d';
export const BCRYPT_ROUNDS = 10;
