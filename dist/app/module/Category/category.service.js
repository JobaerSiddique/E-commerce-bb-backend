"use strict";
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
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = require("./category.model");
const createCategoryDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield category_model_1.Category.findOne({
        $or: [
            { name: payload.name },
            { slug: payload.slug }
        ]
    });
    if (existingCategory) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Category already exists with this name or slug');
    }
    // Create the category if it doesn't exist
    const category = yield category_model_1.Category.create(payload);
    return category;
});
exports.CategoryService = {
    createCategoryDB
};
