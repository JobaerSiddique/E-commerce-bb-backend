import { Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'vendor';
  avatar: string;
  provider: 'local' | 'google' | 'facebook';
  providerId?: string;
  phone?: string;
  addresses: Address[];
  wishlist: Types.ObjectId[];
  isDeleted:boolean;
  
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}
export  type TUserRole = keyof typeof USER_ROLE