"use strict";
// import  httpStatus  from 'http-status';
// import AppError from "../../errors/AppError";
// import { fileUploader } from "../../helpers/fileUploader";
// import { IProduct } from "./product.interface"
// import { Product } from "./product.model";
// import mongoose from 'mongoose';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("./product.model");
const fileUploader_1 = require("../../helpers/fileUploader");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_constant_1 = require("./product.constant");
const createProductDB = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (!files || files.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Product images are required');
    }
    // 2. Check for duplicate product
    const duplicateConditions = {
        title: payload.title,
    };
    const existingProduct = yield product_model_1.Product.findOne({ title: payload.title, isDeleted: false });
    if (existingProduct) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `Product with name ${payload.title} already exists`);
    }
    console.log({ files });
    const uploadedImages = [];
    try {
        for (const file of files) {
            const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadResult) {
                uploadedImages.push(uploadResult.secure_url);
            }
        }
        // 4. Create product with image URLs
        const productData = Object.assign(Object.assign({}, payload), { images: uploadedImages });
        const product = yield product_model_1.Product.create(productData);
        return product;
    }
    catch (error) {
        console.log(error);
    }
});
const getSingleProductDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product Not Found");
    }
    if (product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product Already Deleted");
    }
    return product;
});
//  getAll product
const getAllProductIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fix typo in isDeleted filter
        const baseQuery = product_model_1.Product.find({ isDeleted: false });
        // Initialize query builder
        const productQuery = new QueryBuilder_1.default(baseQuery, query)
            .search(product_constant_1.productSearchableFields)
            .filter()
            .sort()
            .fields()
            .paginate();
        // Execute query and get total count with the same filters
        const [result, total] = yield Promise.all([
            productQuery.modelQuery.exec(),
            product_model_1.Product.countDocuments(productQuery.modelQuery.getFilter())
        ]);
        // Validate and calculate pagination
        const limit = Math.max(1, Math.min(Number(query.limit) || 10, 100)); // Limit to 1-100
        const page = Math.max(1, Number(query.page) || 1);
        const totalPage = Math.ceil(total / limit);
        return {
            meta: {
                page,
                limit,
                total,
                totalPage
            },
            data: result
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve products", error.stack // Include stack trace for debugging
        );
    }
});
const deleteProductIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ _id: id });
    if (product === null || product === void 0 ? void 0 : product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Product Already Deleted");
    }
    const deletedProduct = yield product_model_1.Product.findOneAndUpdate({ _id: product._id }, {
        isDeleted: true
    });
    return deleteProductIntoDB;
});
const updateProductIntoDB = (id, payload // Using Partial to allow updating specific fields
) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if product exists and is not deleted
    const product = yield product_model_1.Product.findOne({ _id: id });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    if (product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Product already deleted");
    }
    // Validate discount_price if provided
    if (payload.discount_price && payload.discount_price >= (payload.price || product.price)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Discount price must be less than regular price");
    }
    // Update product with options
    const updatedProduct = yield product_model_1.Product.findOneAndUpdate({ _id: id }, Object.assign({}, payload), // Spread the payload correctly
    {
        new: true, // Return the updated document
        runValidators: true // Run schema validations on update
    });
    return updatedProduct;
});
exports.ProductService = {
    createProductDB,
    getAllProductIntoDB,
    deleteProductIntoDB,
    updateProductIntoDB,
    getSingleProductDB
};
