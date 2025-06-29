import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";


const createUser = catchAsync(async(req,res)=>{
    const user = req.body;
    console.log(user);
    const result = await UserService.createUserDB(user)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"User Registration successfully",
        data:result

    })
})


const createAdmin = catchAsync(async(req,res)=>{
    const user  = req.body;
    const result = await UserService.createAdminDB(user);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Admin Registration successfully",
        data:result

    })
})

const createLocalUser= catchAsync(async(req,res)=>{
    const user = req.body;
    const result = await UserService.createLocalUserFromDB(user);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Admin Registration successfully",
        data:result

    })
})
const getAllUser = catchAsync(async(req,res)=>{
    const result =await UserService.getAllUserIntoDB()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User Retrived Successfully",
        data:result

    })
})

const createWholerSeller = catchAsync(async(req,res)=>{
    const user = req.body;
   
    const result = await UserService.createWholerIntoDB(user);
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"whole seller Registration successfully",
        data:result

    })
})

const deleteUser = catchAsync(async(req,res)=>{
    const {id} =req.params;
    const result = await UserService.deleteUserIntoDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Deleted User successfully",
        data:result

    })
})

const userStatus = catchAsync(async(req,res)=>{
    const {id} =req.params;
    const result = await UserService.userStatusIntoDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Blocked User Successfully",
        data:result

    })
})
export const UserController = {
    createUser,
    createAdmin,
    getAllUser,
    createLocalUser,
    createWholerSeller,
    deleteUser,
    userStatus
}