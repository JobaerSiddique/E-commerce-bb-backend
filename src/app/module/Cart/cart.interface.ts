import { Types } from "mongoose";
import { IProduct } from "../Product/product.interface";

export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number;
   originalPrice: number;
  selected: boolean;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  totalDiscount:number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}