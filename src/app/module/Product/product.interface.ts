import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IReview {
  user: Types.ObjectId | IUser;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  images: string[];
  stock: number;
  rating?: number;
  category: string[];
  description: string;
  features: string[];
  reviews: IReview[];
  isDeleted:Boolean;
  createdAt: Date;
  updatedAt: Date;
}