import  httpStatus  from 'http-status';
import AppError from '../../errors/AppError';
import { ICategory } from './category.interface';
import { Category } from './category.model';


const createCategoryDB = async(payload:ICategory)=>{
    const existingCategory = await Category.findOne({ 
    $or: [
      { name: payload.name },
      { slug: payload.slug }
    ]
  });

  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, 'Category already exists with this name or slug');
  }

  // Create the category if it doesn't exist
  const category = await Category.create(payload);
  return category;
}




export const CategoryService = {
    createCategoryDB
}