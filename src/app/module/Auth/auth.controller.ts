import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from '../../errors/AppError';


const UserLogin = catchAsync(async(req,res)=>{
    const {email,password}= req.body;
    console.log(req.body);
    const result = await AuthService.userLoginDB(email,password);
    const {accessToken,refreshToken} = result
    res.cookie('refreshToken',refreshToken)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User Login Successfully",
        data:{accessToken}
    })
})

const forgetPassword = catchAsync(async(req,res)=>{
    const {email} = req.body;
    const result = await AuthService.forgetPasswordDB(email)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password Link has been sent in the email",
        data:''
    })
})

const resetPassword = catchAsync(async(req,res)=>{
    const token = req.headers.authorization;
   
    if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong !');
      }
      const {password} = req.body;
      const result = await AuthService.resetPasswordIntoDB(password,token)
      sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password reset successfully",
        data:result
    })
})

const refreshToken = catchAsync(async(req,res)=>{
    const {refreshToken} = req.cookies;
    const result = await AuthService.refreshTokenDB(refreshToken);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Access token is retrieved succesfully!",
        data: result
    })
})
export const AuthController = {
    UserLogin,
    forgetPassword,
    resetPassword,
    refreshToken
}