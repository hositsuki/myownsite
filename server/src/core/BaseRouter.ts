import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query, ValidationChain } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/authenticate';

export interface RouterConfig {
  basePath: string;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export interface ValidationRules {
  create?: ValidationChain[];
  update?: ValidationChain[];
  delete?: ValidationChain[];
  get?: ValidationChain[];
  list?: ValidationChain[];
}

export class BaseRouter {
  protected router: Router;
  protected config: RouterConfig;
  protected validationRules: ValidationRules;

  constructor(config: RouterConfig, validationRules: ValidationRules = {}) {
    this.router = Router();
    this.config = config;
    this.validationRules = validationRules;
    this.setupDefaultValidationRules();
  }

  private setupDefaultValidationRules() {
    if (!this.validationRules.get) {
      this.validationRules.get = [
        param('id').notEmpty().withMessage('ID is required'),
      ];
    }

    if (!this.validationRules.list) {
      this.validationRules.list = [
        query('page').optional().isInt().withMessage('Page must be an integer'),
        query('limit').optional().isInt().withMessage('Limit must be an integer'),
      ];
    }
  }

  protected applyMiddleware(handlers: any[]) {
    const middleware = [];
    
    if (this.config.requireAuth) {
      middleware.push(authenticate);
    }
    
    if (this.config.requireAdmin) {
      middleware.push(requireAdmin);
    }

    return [...middleware, ...handlers];
  }

  protected setupRoute(method: string, path: string, handlers: any[], validationRules: ValidationChain[] = []) {
    const allHandlers = this.applyMiddleware([
      ...validationRules,
      validateRequest,
      ...handlers,
    ]);

    switch (method.toLowerCase()) {
      case 'get':
        this.router.get(path, ...allHandlers);
        break;
      case 'post':
        this.router.post(path, ...allHandlers);
        break;
      case 'put':
        this.router.put(path, ...allHandlers);
        break;
      case 'delete':
        this.router.delete(path, ...allHandlers);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // 通用的CRUD路由设置方法
  public setupCrudRoutes(controller: any) {
    // List
    if (controller.list) {
      this.setupRoute('get', '/', [controller.list], this.validationRules.list);
    }

    // Get by ID
    if (controller.get) {
      this.setupRoute('get', '/:id', [controller.get], this.validationRules.get);
    }

    // Create
    if (controller.create) {
      this.setupRoute('post', '/', [controller.create], this.validationRules.create);
    }

    // Update
    if (controller.update) {
      this.setupRoute('put', '/:id', [controller.update], this.validationRules.update);
    }

    // Delete
    if (controller.delete) {
      this.setupRoute('delete', '/:id', [controller.delete], this.validationRules.delete);
    }
  }

  // 添加自定义路由
  public addCustomRoute(method: string, path: string, handlers: any[], validationRules: ValidationChain[] = []) {
    this.setupRoute(method, path, handlers, validationRules);
  }

  public getRouter() {
    return this.router;
  }
}
