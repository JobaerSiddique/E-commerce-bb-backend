// import  httpStatus  from 'http-status';
// import AppError from "../../errors/AppError";
// import { fileUploader } from "../../helpers/fileUploader";
// import { IProduct } from "./product.interface"
// import { Product } from "./product.model";
// import mongoose from 'mongoose';

// const createProductDB = async (payload: IProduct, files: Express.Multer.File[]) => {
  
// };






// export const ProductService={
//     createProductDB
// }
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Product } from './product.model';
import { fileUploader } from '../../helpers/fileUploader';
import AppError from '../../errors/AppError';
import { IProduct } from './product.interface';
import path from 'path';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';

const createProductDB = async (payload: IProduct, files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product images are required');
  }

  // 2. Check for duplicate product
  const duplicateConditions: any = {
    title: payload.title,
   
  };
  
  const existingProduct = await Product.findOne({title:payload.title,isDeleted:false});
  if (existingProduct) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Product with name ${payload.title} already exists`
    );
  }
  console.log({files});
  const uploadedImages: string[] = [];
  try {
    for (const file of files) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      
      if (uploadResult) {
        uploadedImages.push(uploadResult.secure_url);
      }
     
    }
  

    // 4. Create product with image URLs
    const productData = {
      ...payload,
      images: uploadedImages,
    };

    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.log(error);
  }
};

const getSingleProductDB = async(id:string)=>{
  const product = await Product.findById(id)

  if(!product){
    throw new AppError(httpStatus.NOT_FOUND,"Product Not Found")
  }
  if(product.isDeleted){
       throw new AppError(httpStatus.NOT_FOUND,"Product Already Deleted")
  }

  return product;
}

//  getAll product
const getAllProductIntoDB = async (query: Record<string, unknown>) => {
  try {
    // Fix typo in isDeleted filter
    const baseQuery = Product.find({ isDeleted: false });
    
    // Initialize query builder
    const productQuery = new QueryBuilder(baseQuery, query)
      .search(productSearchableFields)
      .filter()
      .sort()
      .fields()
      .paginate();

    // Execute query and get total count with the same filters
    const [result, total] = await Promise.all([
      productQuery.modelQuery.exec(),
      Product.countDocuments(productQuery.modelQuery.getFilter())
    ]);

    // Validate and calculate pagination
    const limit = Math.max(1, Math.min(Number(query.limit) || 10, 100)); // Limit to 1-100
    const page = Math.max(1, Number(query.page) || 1);
    const totalPage = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage
      },
      data: result
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve products",
      error.stack // Include stack trace for debugging
    );
  }
};

const deleteProductIntoDB = async(id:string)=>{
  const product = await Product.findOne({_id:id})

  if(product?.isDeleted){
    throw new AppError(httpStatus.CONFLICT,"Product Already Deleted")
  }

  const deletedProduct = await Product.findOneAndUpdate({_id:product._id},{
    isDeleted:true
  })

  return deleteProductIntoDB
}
const updateProductIntoDB = async (
  id: string,
  payload: Partial<IProduct> // Using Partial to allow updating specific fields
): Promise<IProduct | null> => {
  // Check if product exists and is not deleted
  const product = await Product.findOne({ _id: id });
  
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (product.isDeleted) {
    throw new AppError(httpStatus.CONFLICT, "Product already deleted");
  }

  // Validate discount_price if provided
  if (payload.discount_price && payload.discount_price >= (payload.price || product.price)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount price must be less than regular price"
    );
  }

  // Update product with options
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    { ...payload }, // Spread the payload correctly
    { 
      new: true, // Return the updated document
      runValidators: true // Run schema validations on update
    }
  );

  return updatedProduct;
};


export const ProductService = {
  createProductDB,
  getAllProductIntoDB,
  deleteProductIntoDB,
  updateProductIntoDB,
  getSingleProductDB
};