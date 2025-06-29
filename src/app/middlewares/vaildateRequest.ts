import  httpStatus  from 'http-status';
import AppError from '../errors/AppError';
import { NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';


const validateRequest = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(httpStatus.BAD_REQUEST, error.message));
      } else {
        next(new AppError(httpStatus.BAD_REQUEST, 'Validation failed'));
      }
    }
  };
};

export default validateRequest;