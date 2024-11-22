import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import postsRouter from './routes/posts';
import openaiRouter from './routes/openai';
import imagesRouter from './routes/images';
import previewRouter from './routes/preview';
import commentsRouter from './routes/comments';
import rssRouter from './routes/rss';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// 配置 CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 连接MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-blog';
mongoose.connect(MONGODB_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Could not connect to MongoDB:', err));

// 路由
app.use('/images', imagesRouter);  
app.use('/api/posts', postsRouter);
app.use('/api/openai', openaiRouter);
app.use('/api/preview', previewRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/rss', rssRouter);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

export default app;
