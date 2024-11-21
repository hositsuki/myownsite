import express, { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import { auth } from '../middleware/auth';
import { generateTags, estimateReadTime } from '../services/openai';
import { cacheService } from '../services/cache';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    username: string;
    avatar?: string;
  };
}

interface PostQuery {
  status?: string;
  category?: string;
  $or?: Array<{
    status: string;
    scheduledPublishDate?: { $lte: Date };
  }>;
  tags?: string;
  _id?: { $ne: Types.ObjectId };
}

const router = express.Router();

// 获取所有文章（可选择状态和分类）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category } = req.query;
    const query: PostQuery = {};
    
    // 仅管理员可以看到非发布状态的文章
    if (status) {
      if (status !== 'published' && !req.headers.authorization) {
        return res.status(403).json({ message: 'Unauthorized to view non-published posts' });
      }
      query.status = status as string;
    } else {
      // 非管理员只能看到已发布的文章
      if (!req.headers.authorization) {
        query.status = 'published';
      }
    }

    // 处理定时发布的文章
    if (!req.headers.authorization) {
      query.$or = [
        { status: 'published' },
        {
          status: 'scheduled',
          scheduledPublishDate: { $lte: new Date() }
        }
      ];
    }

    if (category) {
      query.category = category as string;
    }

    // Try to get from cache first
    const cachedPosts = await cacheService.getPostList();
    if (cachedPosts) {
      return res.json(cachedPosts);
    }

    const posts = await Post.find(query)
      .sort({ date: -1 })
      .select('title excerpt date tags readTime slug author status category views version lastModified');
    
    // Cache the results
    await cacheService.setPostList(posts);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// 获取所有分类
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await Post.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// 通过标签获取文章
router.get('/tags/:tag', async (req: Request, res: Response) => {
  try {
    const query: PostQuery = { 
      tags: req.params.tag,
      ...((!req.headers.authorization) && { status: 'published' })
    };

    const posts = await Post.find(query)
      .sort({ date: -1 })
      .select('title excerpt date tags readTime slug author status category views');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by tag', error });
  }
});

// 通过slug获取单篇文章
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cachedPost = await cacheService.getPost(req.params.slug);
    if (cachedPost) {
      return res.json(cachedPost);
    }

    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } }, // 增加访问计数
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 检查草稿权限
    if (post.status === 'draft' && !req.headers.authorization) {
      return res.status(403).json({ message: 'Unauthorized to view draft' });
    }

    // Cache the post
    await cacheService.setPost(req.params.slug, post);
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

// 创建新文章（需要认证）
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, category, slug, author, status, scheduledPublishDate } = req.body;

    // 生成标签和估算阅读时间
    const tags = await generateTags(title, content);
    const readTime = await estimateReadTime(content);

    const post = new Post({
      title,
      content,
      excerpt,
      category,
      slug,
      author,
      status,
      scheduledPublishDate,
      tags,
      readTime,
      version: 1,
      lastModified: new Date(),
      statusHistory: [{
        status,
        date: new Date(),
        updatedBy: author.name
      }]
    });

    const newPost = await post.save();
    
    // Invalidate post list cache
    await cacheService.invalidatePostList();
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// 更新文章（需要认证）
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, category, status, scheduledPublishDate } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 生成新标签和估算阅读时间
    const tags = await generateTags(title, content);
    const readTime = await estimateReadTime(content);

    // 更新状态历史
    if (status && status !== post.status) {
      post.statusHistory.push({
        status,
        date: new Date(),
        updatedBy: req.user.username
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          content,
          excerpt,
          category,
          status,
          scheduledPublishDate,
          tags,
          readTime,
          lastModified: new Date(),
          version: (post.version || 0) + 1
        }
      },
      { new: true }
    );

    // Invalidate both post and list cache
    await cacheService.invalidatePost(post.slug);
    await cacheService.invalidatePostList();
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

// 删除文章（需要认证）
router.delete('/:slug', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Invalidate both post and list cache
    await cacheService.invalidatePost(req.params.slug);
    await cacheService.invalidatePostList();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});

// 添加评论
router.post('/:slug/comments', async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error });
  }
});

// 管理评论（需要认证）
router.patch('/:slug/comments/:commentId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 更新评论状态
    comment.isApproved = req.body.isApproved;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error updating comment', error });
  }
});

// 获取相关文章
router.get('/:id/related', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 基于标签查找相关文章
    const relatedPosts = await Post.find({
      _id: { $ne: post._id },
      tags: { $in: post.tags },
      status: 'published'
    })
      .sort({ date: -1 })
      .limit(3)
      .select('title excerpt date tags readTime slug author');

    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching related posts', error });
  }
});

// 更新文章状态
router.patch('/:slug/status', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { status, scheduledPublishDate } = req.body;
    const post = await Post.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = status;
    if (status === 'scheduled' && scheduledPublishDate) {
      post.scheduledPublishDate = new Date(scheduledPublishDate);
    }

    await post.save();
    
    // Invalidate post cache
    await cacheService.invalidatePost(req.params.slug);
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post status', error });
  }
});

// 获取文章历史记录
router.get('/:slug/history', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.findOne({ slug: req.params.slug })
      .select('statusHistory version lastModified');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post history', error });
  }
});

// 自动保存
router.post('/:slug/autosave', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { content } = req.body;
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { 
        autoSaveContent: content,
        autoSaveDate: new Date()
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error auto-saving post', error });
  }
});

export default router;
