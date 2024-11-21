import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts';
import openaiRouter from './routes/openai';
import imagesRouter from './routes/images';
import previewRouter from './routes/preview';
import commentsRouter from './routes/comments';

dotenv.config();

const app = express();

// 配置 CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 连接MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-blog';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// 路由
app.use('/images', imagesRouter);  
app.use('/api/posts', postsRouter);
app.use('/api/openai', openaiRouter);
app.use('/api/preview', previewRouter);
app.use('/api/comments', commentsRouter);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    if (!res.headersSent) {
        res.status(500).json({ 
            success: false, 
            error: err.message || 'Internal Server Error' 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
