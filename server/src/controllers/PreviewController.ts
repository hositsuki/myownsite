import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../core/ApiError';
import { PostService } from '../services/PostService';
import { marked } from 'marked';
import { BaseController } from '../core/BaseController';

export class PreviewController extends BaseController {
  static async previewMarkdown(req: Request, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { markdown } = req.body;
      this.validateRequiredParams({ markdown });

      const html = marked(markdown);
      return this.sendSuccess(res, { html });
    });
  }

  static async previewPost(req: Request, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { slug } = req.params;
      this.validateRequiredParams({ slug });

      const post = await PostService.getPostBySlug(slug, true);
      if (!post) {
        throw new ApiError(404, 'Post not found');
      }

      const html = marked(post.content);
      return this.sendSuccess(res, { 
        title: post.title,
        html,
        metadata: {
          author: post.author,
          date: post.createdAt,
          tags: post.tags,
          readTime: post.readTime
        }
      });
    });
  }
}
