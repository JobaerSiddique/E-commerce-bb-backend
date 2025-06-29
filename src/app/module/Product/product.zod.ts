import { z } from 'zod';

const createProductSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).min(3).max(100),
    price: z.number({
      required_error: 'Price is required',
    }).positive(),
    description: z.string().min(10).max(1000).optional(),
    category: z.string({
      required_error: 'Category is required',
    }),
    stock: z.number().int().nonnegative().default(0),
    discount_price: z.number().optional(),
    features: z.array(z.string()).optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
};