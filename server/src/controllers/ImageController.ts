import { Request, Response, NextFunction } from 'express';
import { ImageService } from '../services/images';
import { ApiError } from '../core/ApiError';
import { AuthRequest } from '../types/auth';
import { BaseController } from '../core/BaseController';

export class ImageController extends BaseController {
  private static imageService = new ImageService();

  static async uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      if (!req.file) {
        throw new ApiError(400, 'No image file provided');
      }

      const result = await ImageController.imageService.uploadImage(req.file);
      return this.sendSuccess(res, result, 'Image uploaded successfully', 201);
    });
  }

  static async getImage(req: Request, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { filename } = req.params;
      this.validateRequiredParams({ filename });

      const imageBuffer = await ImageController.imageService.getImage(filename);
      res.contentType('image/jpeg');
      res.send(imageBuffer);
    });
  }

  static async deleteImage(req: AuthRequest, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { filename } = req.params;
      this.validateRequiredParams({ filename });

      await ImageController.imageService.deleteImage(filename);
      return this.sendSuccess(res, null, 'Image deleted successfully');
    });
  }

  static async optimizeImage(req: Request, res: Response, next: NextFunction) {
    return this.wrapAsync(req, res, next, async () => {
      const { filename } = req.params;
      const { width, height, quality } = req.query;
      this.validateRequiredParams({ filename });

      const optimizedImage = await ImageController.imageService.optimizeImage(
        filename,
        {
          width: width ? parseInt(width as string) : undefined,
          height: height ? parseInt(height as string) : undefined,
          quality: quality ? parseInt(quality as string) : undefined,
        }
      );

      res.contentType('image/jpeg');
      res.send(optimizedImage);
    });
  }
}
