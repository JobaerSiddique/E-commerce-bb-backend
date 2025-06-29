"use strict";
// import  httpStatus  from 'http-status';
// import express, { NextFunction, Request, Response } from 'express'
// import { fileUploader } from '../../helpers/fileUploader';
// import AppError from '../../errors/AppError';
// import { ProductController } from './product.controller';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
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
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../helpers/fileUploader");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_controller_1 = require("./product.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// 1. First create a properly typed middleware function
const parseProductDataMiddleware = (req, res, next) => {
    try {
        if (!req.body.data) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing product data");
        }
        req.body = JSON.parse(req.body.data);
        next(); // Just call next() without returning anything
    }
    catch (error) {
        next(error); // Pass error to Express error handler
    }
};
// 2. Use it in your route
router.post('/', (0, Auth_1.default)(user_constant_1.USER_ROLE.admin), fileUploader_1.fileUploader.upload.array('files', 5), parseProductDataMiddleware, // Use the typed middleware
product_controller_1.ProductController.createProduct);
router.get('/', (0, Auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), product_controller_1.ProductController.getAllProduct);
router.get('/:id', (0, Auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), product_controller_1.ProductController.getSingleProduct);
router.delete('/:id', (0, Auth_1.default)(user_constant_1.USER_ROLE.admin), product_controller_1.ProductController.deleteProduct);
router.put('/:id', (0, Auth_1.default)(user_constant_1.USER_ROLE.admin), product_controller_1.ProductController.updateProduct);
exports.ProductRoute = router;
