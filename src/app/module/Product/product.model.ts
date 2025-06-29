import { model, Schema } from "mongoose";
import { IProduct, IReview } from "./product.interface";

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive']
  },
  discount_price: {
    type: Number,
    validate: {
      validator: function(value: number) {
        return value < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: {
      validator: (images: string[]) => images.length > 0,
      message: 'At least one product image is required'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  category: {
    type: [String],
    
    required: [true, 'Product category is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  features: {
    type: [String],
    required: [true, 'Product features are required'],
    validate: {
      validator: (features: string[]) => features.length > 0,
      message: 'At least one product feature is required'
    }
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = parseFloat((total / this.reviews.length).toFixed(1));
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discount_percentage').get(function() {
  if (!this.discount_price) return 0;
  return Math.round(((this.price - this.discount_price) / this.price) * 100);
});

// Indexes for better performance
productSchema.index({ product_name: 'text', description: 'text', features: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ category: 1 });

export const Product = model<IProduct>('Product', productSchema);