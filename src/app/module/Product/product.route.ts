// import  httpStatus  from 'http-status';
// import express, { NextFunction, Request, Response } from 'express'
// import { fileUploader } from '../../helpers/fileUploader';
// import AppError from '../../errors/AppError';
// import { ProductController } from './product.controller';

// const router = express.Router()

// router.post('/',fileUploader.upload.array('files', 5), // Limit to 5 files
//     (req: Request, res: Response, next: NextFunction) => {
//       try {
//         if (!req.body.data) {
//           throw new AppError(httpStatus.BAD_REQUEST, "Missing product data");
//         }
//         req.body = JSON.parse(req.body.data);
//         console.log(req.body);
//         next();
//       } catch (error) {
//         next(new AppError(httpStatus.BAD_REQUEST, "Invalid product data format"));
//       }
//     },
//    ProductController.createProduct
// )





// export const ProductRoute= router

import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { fileUploader } from '../../helpers/fileUploader';
import AppError from '../../errors/AppError';
import { ProductController } from './product.controller';
import Auth from '../../middlewares/Auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/vaildateRequest';
import { ProductValidation } from './product.zod';

const router = express.Router();
// 1. First create a properly typed middleware function
const parseProductDataMiddleware: RequestHandler = (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new AppError(httpStatus.BAD_REQUEST, "Missing product data");
    }
    req.body = JSON.parse(req.body.data);
    next(); // Just call next() without returning anything
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
};

// 2. Use it in your route
router.post(
  '/',
  Auth(USER_ROLE.admin),
  fileUploader.upload.array('files', 5),
  parseProductDataMiddleware, // Use the typed middleware
  
  
  ProductController.createProduct
);

  router.get('/',Auth(USER_ROLE.user,USER_ROLE.admin),ProductController.getAllProduct)
  router.get('/:id',Auth(USER_ROLE.user,USER_ROLE.admin),ProductController.getSingleProduct)
  router.delete('/:id',Auth(USER_ROLE.admin),ProductController.deleteProduct)
  router.put('/:id',Auth(USER_ROLE.admin),ProductController.updateProduct)

export const ProductRoute = router;