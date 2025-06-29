import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from 'bcrypt'
const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: { 
    type: String,
    minlength: 8,
    select: false
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'vendor'], 
    default: 'user' 
  },
  avatar: { 
    type: String, 
    default: 'https://res.cloudinary.com/your-cloud/image/upload/v1620000000/avatars/default.png'
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  providerId: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, 'Invalid phone number']
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: Boolean
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
    isDeleted: {
    type: Boolean,
    select: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password Hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

export const User = model<IUser>('User', userSchema);