import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartService } from "./cart.service";


const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const userEmail = req.user.userId; // Assuming user is attached to request from auth middleware
    console.log(req.user.userId);
  const result = await CartService.addToCartDB({
    userEmail,
    productId,
    quantity
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added to cart successfully',
    data: result
  });
});

const getAllCart = catchAsync(async(req,res)=>{
    const result = await CartService.getAllCart()
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' cart Retrived successfully',
    data: result
  });
})

const getUserCart = catchAsync(async(req,res)=>{
    const userId= req.user.userId;
    const result = await CartService.getUserCartDB(userId)
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' cart Retrived successfully',
    data: result
  });
})
export const CartController = {
   addToCart,
   getAllCart,
   getUserCart
}