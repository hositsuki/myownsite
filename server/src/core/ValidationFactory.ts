import { body, param, query, ValidationChain } from 'express-validator';

export interface ValidationConfig {
  field: string;
  rules: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | Promise<boolean>;
    message?: string;
  };
}

export class ValidationFactory {
  static createValidation(config: ValidationConfig): ValidationChain[] {
    const { field, rules } = config;
    const chain = body(field);

    if (rules.required) {
      chain.notEmpty().withMessage(rules.message || `${field} is required`);
    }

    if (rules.type) {
      switch (rules.type) {
        case 'string':
          chain.isString().withMessage(rules.message || `${field} must be a string`);
          break;
        case 'number':
          chain.isNumeric().withMessage(rules.message || `${field} must be a number`);
          break;
        case 'boolean':
          chain.isBoolean().withMessage(rules.message || `${field} must be a boolean`);
          break;
        case 'array':
          chain.isArray().withMessage(rules.message || `${field} must be an array`);
          break;
        case 'object':
          chain.isObject().withMessage(rules.message || `${field} must be an object`);
          break;
      }
    }

    if (rules.min !== undefined) {
      if (rules.type === 'string') {
        chain.isLength({ min: rules.min }).withMessage(rules.message || `${field} must be at least ${rules.min} characters long`);
      } else if (rules.type === 'number') {
        chain.isFloat({ min: rules.min }).withMessage(rules.message || `${field} must be at least ${rules.min}`);
      } else if (rules.type === 'array') {
        chain.isArray({ min: rules.min }).withMessage(rules.message || `${field} must have at least ${rules.min} items`);
      }
    }

    if (rules.max !== undefined) {
      if (rules.type === 'string') {
        chain.isLength({ max: rules.max }).withMessage(rules.message || `${field} must be at most ${rules.max} characters long`);
      } else if (rules.type === 'number') {
        chain.isFloat({ max: rules.max }).withMessage(rules.message || `${field} must be at most ${rules.max}`);
      } else if (rules.type === 'array') {
        chain.isArray({ max: rules.max }).withMessage(rules.message || `${field} must have at most ${rules.max} items`);
      }
    }

    if (rules.pattern) {
      chain.matches(rules.pattern).withMessage(rules.message || `${field} format is invalid`);
    }

    if (rules.custom) {
      chain.custom(rules.custom);
    }

    return [chain];
  }

  static createCommonValidations() {
    return {
      id: [param('id').notEmpty().withMessage('ID is required')],
      pagination: [
        query('page').optional().isInt().withMessage('Page must be an integer'),
        query('limit').optional().isInt().withMessage('Limit must be an integer'),
      ],
      email: ValidationFactory.createValidation({
        field: 'email',
        rules: {
          required: true,
          type: 'string',
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email format',
        },
      }),
      password: ValidationFactory.createValidation({
        field: 'password',
        rules: {
          required: true,
          type: 'string',
          min: 6,
          message: 'Password must be at least 6 characters long',
        },
      }),
    };
  }
}
