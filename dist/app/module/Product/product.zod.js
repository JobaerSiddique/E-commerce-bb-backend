"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }).min(3).max(100),
        price: zod_1.z.number({
            required_error: 'Price is required',
        }).positive(),
        description: zod_1.z.string().min(10).max(1000).optional(),
        category: zod_1.z.string({
            required_error: 'Category is required',
        }),
        stock: zod_1.z.number().int().nonnegative().default(0),
        discount_price: zod_1.z.number().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.ProductValidation = {
    createProductSchema,
};
