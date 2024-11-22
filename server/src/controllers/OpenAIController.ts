import { Request, Response, NextFunction } from 'express';
import { OpenAIService } from '../services/openai';
import { ApiError } from '../core/ApiError';
import { AuthRequest } from '../types/auth';
import { BaseController } from '../core/BaseController';

export class OpenAIController extends BaseController {
  private static openAIService = new OpenAIService();

  static async generateTitle(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { content } = req.body;
      this.validateRequiredParams({ content });

      const title = await OpenAIController.openAIService.generateTitle(content);
      return this.sendSuccess(res, { title });
    });
  }

  static async generateSummary(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { content } = req.body;
      this.validateRequiredParams({ content });

      const summary = await OpenAIController.openAIService.generateSummary(content);
      return this.sendSuccess(res, { summary });
    });
  }

  static async generateTags(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { content } = req.body;
      this.validateRequiredParams({ content });

      const tags = await OpenAIController.openAIService.generateTags(content);
      return this.sendSuccess(res, { tags });
    });
  }

  static async improveWriting(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { content } = req.body;
      this.validateRequiredParams({ content });

      const improvedContent = await OpenAIController.openAIService.improveWriting(content);
      return this.sendSuccess(res, { content: improvedContent });
    });
  }

  static async generateImage(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { prompt } = req.body;
      this.validateRequiredParams({ prompt });

      const imageUrl = await OpenAIController.openAIService.generateImage(prompt);
      return this.sendSuccess(res, { imageUrl });
    });
  }
}
