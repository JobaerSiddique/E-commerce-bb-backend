// import  httpStatus  from 'http-status';
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { ProductService } from './product.service';

// const createProduct = catchAsync(async(req,res)=>{
//      const data =req.body;
    
//     const files = req.files as Express.Multer.File[];
//       const filePaths = files.map((file) => file.path);
//     const result = await ProductService.createProductDB(data,filePaths)
//     sendResponse(res,{
//         statusCode:httpStatus.CREATED,
//         success:true,
//         message:"Product Create Successfully",
//         data:result
//     })
// })



// export const ProductController = {
//     createProduct
// }

import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const data =req.body;
    console.log(req.headers.authorization);
    const files = req.files as Express.Multer.File[];
      const filePaths = files.map((file) => file.path);
    const result = await ProductService.createProductDB(data,filePaths)
 
  
  
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result
  });
});

const getSingleProduct = catchAsync(async(req,res)=>{
   const {id}= req.params;
  const result =await ProductService.getSingleProductDB(id) 
  sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Retrived Successfully",
       
        data:result
        
    })
})

const getAllProduct = catchAsync(async(req,res)=>{
    const result = await ProductService.getAllProductIntoDB(req.query)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Retrived Successfully",
        meta:result.meta,
        data:result.data
        
    })
})

const deleteProduct = catchAsync(async(req,res)=>{
  const {id} =req.params;
    const result = await ProductService.deleteProductIntoDB(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Deleted Successfully",
        
        data:""
        
    })
})

const updateProduct = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const data = req.body;
     const result = await ProductService.updateProductIntoDB(id,data)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product update Successfully",
        
        data:result
        
    })
})
export const ProductController = {
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct
};