import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async(req,res)=>{
    const data= req.body;
    const result = await CategoryService.createCategoryDB(data)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Category Created Successfully",
        data:result
    })
})


export const CategoryController = {
    createCategory
}