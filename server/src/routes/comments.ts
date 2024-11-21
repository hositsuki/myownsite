import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    username: string;
    avatar?: string;
  };
}

const router = express.Router();

// 获取文章的所有评论
router.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// 创建新评论
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = new Comment({
      post: postId,
      author: req.user._id,
      content
    });

    await comment.save();
    await comment.populate('author', 'username avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
});

// 回复评论
router.post('/:commentId/reply', auth, async (req: AuthRequest, res: Response) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const reply = new Comment({
      post: parentComment.post,
      author: req.user._id,
      content: req.body.content
    });

    await reply.save();
    parentComment.replies.push(reply._id);
    await parentComment.save();

    await reply.populate('author', 'username avatar');
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reply', error });
  }
});

// 点赞评论
router.post('/:commentId/like', auth, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes += 1;
    await comment.save();
    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking comment', error });
  }
});

// 编辑评论
router.put('/:commentId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await Comment.findOne({
      _id: req.params.commentId,
      author: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
});

// 删除评论
router.delete('/:commentId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await Comment.findOne({
      _id: req.params.commentId,
      author: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

export default router;
