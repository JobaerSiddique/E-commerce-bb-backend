import { model, Schema } from "mongoose";
import { ICart } from "./cart.interface";

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    originalPrice: {
      type: Number,
      required: true
    },
    selected: {
      type: Boolean,
      default: true
    }
  }],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    totalItems: this.items.reduce((total, item) => total + item.quantity, 0),
    totalOriginalPrice: this.items.reduce((total, item) => 
      total + (item.originalPrice * item.quantity), 0),
    totalPrice: this.totalPrice,
    totalDiscount: this.totalDiscount,
    payable: this.totalPrice
  };
});

export const  Cart = model('cart',cartSchema)