import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import Post from '../models/Post';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    username: string;
    avatar?: string;
  };
}

interface PreviewContent {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  previewId: string;
  createdAt: Date;
}

// 扩展全局命名空间
declare global {
  var previews: Map<string, PreviewContent>;
}

const router = express.Router();

// 创建预览
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 生成临时的预览ID
    const previewId = Math.random().toString(36).substring(7);
    
    // 将预览内容存储在内存中（在生产环境中应该使用Redis等缓存系统）
    const previewContent: PreviewContent = {
      ...req.body,
      previewId,
      createdAt: new Date(),
    };

    // 这里使用了内存存储，实际生产环境建议使用Redis
    if (!global.previews) {
      global.previews = new Map();
    }
    global.previews.set(previewId, previewContent);

    // 设置预览过期时间（1小时后）
    setTimeout(() => {
      if (global.previews) {
        global.previews.delete(previewId);
      }
    }, 3600000);

    res.json({ previewId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating preview', error });
  }
});

// 获取预览
router.get('/:previewId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { previewId } = req.params;
    
    if (!global.previews || !global.previews.has(previewId)) {
      return res.status(404).json({ message: 'Preview not found or expired' });
    }

    const previewContent = global.previews.get(previewId);
    res.json(previewContent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching preview', error });
  }
});

export default router;
