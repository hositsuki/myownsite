import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { InternalError } from '../core/ApiError';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  /**
   * 为博客文章生成标签
   * @param title - 文章标题
   * @param content - 文章内容
   * @returns Promise<string[]> - 生成的标签数组
   */
  static async generateTags(title: string, content: string): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates relevant tags for blog posts. Generate only the tags, no other text."
          },
          {
            role: "user",
            content: `Title: ${title}\nContent: ${content}\nPlease generate 3-5 relevant tags for this content.`
          }
        ],
        temperature: 0.7,
      });

      const tagsText = completion.choices[0]?.message?.content || '';
      const tags = tagsText
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      return tags;
    } catch (error) {
      logger.error('标签生成失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`标签生成失败: ${error.message}`);
      }
      throw new InternalError('标签生成失败');
    }
  }

  /**
   * 估算文章阅读时间
   * @param content - 文章内容
   * @returns Promise<number> - 预计阅读时间（分钟）
   */
  static async estimateReadTime(content: string): Promise<number> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that estimates reading time for articles. Return only the number of minutes."
          },
          {
            role: "user",
            content: `Please estimate the reading time in minutes for the following content:\n\n${content}`
          }
        ],
        temperature: 0.5,
      });

      const timeText = completion.choices[0]?.message?.content || '5';
      const readTime = parseInt(timeText.match(/\d+/)?.[0] || '5', 10);

      return readTime;
    } catch (error) {
      logger.error('阅读时间估算失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`阅读时间估算失败: ${error.message}`);
      }
      throw new InternalError('阅读时间估算失败');
    }
  }

  /**
   * 生成文章摘要
   * @param content - 文章内容
   * @returns Promise<string> - 生成的摘要
   */
  static async generateSummary(content: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文章摘要生成助手。请生成一段简洁的摘要，突出文章的主要观点和价值。"
          },
          {
            role: "user",
            content: `请为以下内容生成一个简洁的摘要：\n\n${content}`
          }
        ],
        temperature: 0.7,
      });

      const summary = completion.choices[0]?.message?.content || '';
      return summary;
    } catch (error) {
      logger.error('摘要生成失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`摘要生成失败: ${error.message}`);
      }
      throw new InternalError('摘要生成失败');
    }
  }

  /**
   * 优化文章标题
   * @param content - 文章内容
   * @returns Promise<string> - 优化后的标题
   */
  static async generateTitle(content: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一个专业的标题优化助手。请生成一个吸引人、准确反映文章内容的标题。"
          },
          {
            role: "user",
            content: `请为以下内容生成一个优化的标题：\n\n${content}`
          }
        ],
        temperature: 0.7,
      });

      const optimizedTitle = completion.choices[0]?.message?.content || '';
      return optimizedTitle;
    } catch (error) {
      logger.error('标题优化失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`标题优化失败: ${error.message}`);
      }
      throw new InternalError('标题优化失败');
    }
  }

  /**
   * 改进文章内容
   * @param content - 原文内容
   * @returns Promise<string> - 改进后的内容
   */
  static async improveWriting(content: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文章改进助手。请改进文章的表达和结构，使其更加清晰、专业和有吸引力，同时保持原文的主要观点和风格。"
          },
          {
            role: "user",
            content: `请改进以下文章内容：\n\n${content}`
          }
        ],
        temperature: 0.7,
      });

      const improvedContent = completion.choices[0]?.message?.content || '';
      return improvedContent;
    } catch (error) {
      logger.error('内容改进失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`内容改进失败: ${error.message}`);
      }
      throw new InternalError('内容改进失败');
    }
  }

  /**
   * 生成图片
   * @param prompt - 图片描述
   * @returns Promise<string> - 生成的图片URL
   */
  static async generateImage(prompt: string): Promise<string> {
    try {
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }

      return imageUrl;
    } catch (error) {
      logger.error('图片生成失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`图片生成失败: ${error.message}`);
      }
      throw new InternalError('图片生成失败');
    }
  }
}
