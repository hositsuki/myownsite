import { Request, Response, NextFunction } from 'express';
import { Feed } from 'feed';
import { ApiError } from '../core/ApiError';
import { PostService } from '../services/PostService';
import { marked } from 'marked';
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_EMAIL } from '../config';
import { BaseController } from '../core/BaseController';

export class RssController extends BaseController {
  static async generateRssFeed(req: Request, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const posts = await PostService.getAllPosts({ status: 'published' }, false);
      
      const feed = new Feed({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        id: SITE_URL,
        link: SITE_URL,
        language: 'zh',
        image: `${SITE_URL}/logo.png`,
        favicon: `${SITE_URL}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR_NAME}`,
        updated: posts[0]?.createdAt ? new Date(posts[0].createdAt) : new Date(),
        generator: 'Feed for Node.js',
        feedLinks: {
          rss2: `${SITE_URL}/rss.xml`,
          json: `${SITE_URL}/rss.json`,
          atom: `${SITE_URL}/atom.xml`,
        },
        author: {
          name: AUTHOR_NAME,
          email: AUTHOR_EMAIL,
          link: SITE_URL,
        },
      });

      posts.forEach((post) => {
        const url = `${SITE_URL}/blog/${post.slug}`;
        feed.addItem({
          title: post.title,
          id: url,
          link: url,
          description: post.excerpt,
          content: marked(post.content),
          author: [
            {
              name: post.author?.name || AUTHOR_NAME,
              email: AUTHOR_EMAIL,
              link: SITE_URL,
            },
          ],
          date: new Date(post.createdAt),
          image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
        });
      });

      // 根据请求的格式返回不同的 feed
      const format = req.params.format || 'rss';
      let feedContent: string;
      let contentType: string;

      switch (format) {
        case 'atom':
          feedContent = feed.atom1();
          contentType = 'application/atom+xml';
          break;
        case 'json':
          feedContent = feed.json1();
          contentType = 'application/json';
          break;
        default:
          feedContent = feed.rss2();
          contentType = 'application/rss+xml';
      }

      res.header('Content-Type', contentType);
      res.send(feedContent);
    });
  }
}
