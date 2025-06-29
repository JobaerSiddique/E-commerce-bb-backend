
import { User } from "../user/user.model";
import { Types } from "mongoose";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Product } from "../Product/product.model";
import { Cart } from "./cart.model";

const addToCartDB = async (payload: {
  userEmail: string;
  productId: Types.ObjectId;
  quantity: number;
}) => {
  try {
    const { userEmail, productId, quantity } = payload;

    // 1. Find user by email
    const user = await User.findOne({ email: userEmail }).exec();
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // 2. Validate product
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      stock: { $gt: 0 }
    }).exec();

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not available");
    }

    // 3. Check stock availability
    if (quantity > product.stock) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Only ${product.stock} items available in stock`
      );
    }

    // 4. Determine price - use discount if available, otherwise regular price
    const itemPrice = product.discount_price > 0 
      ? product.discount_price 
      : product.price;

    // 5. Find or create cart
    let cart = await Cart.findOne({ user: user._id }).exec();
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
        totalPrice: 0,
        totalDiscount: 0
      });
    }

    // 6. Update cart items
    const existingItemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = itemPrice;
      cart.items[existingItemIndex].originalPrice = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: itemPrice,
        originalPrice: product.price,
        selected: true
      });
    }

    // 7. Calculate totals
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // 8. Calculate total discount
    cart.totalDiscount = cart.items.reduce(
      (total, item) => total + ((item.originalPrice - item.price) * item.quantity),
      0
    );

    // 9. Save cart
    await cart.save();

    // 10. Return populated cart
    return await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title price discount_price images stock'
      })
      .lean()
      .exec();

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add item to cart",
      error.message
    );
  }
};

const getAllCart = async()=>{
    const result = await Cart.find().populate('items')
    return result
}

const getUserCartDB= async(id:string)=>{
    const user = await User.findOne({email:id})

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
    }

    const userCart = await Cart.find({
        user:user
    })
    return userCart
}
export const CartService = {
  addToCartDB,
  getAllCart,
  getUserCartDB
};