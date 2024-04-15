import mongoose, { Schema } from "mongoose";
export const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  desc: String,
  price: {
    type: Number,
    required: true,
    default: 1,
  }, appliedDiscount: {
    type: Number,
    default: 0,
  },
  priceAfter: {
    type: Number,
    default: 0,
  },
  colors:[String],
  sizes: [String],
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  SubCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'subCategory',
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
  },
  Images: [
    {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      }
    }],
  CustomId: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },




}, {
  timestamps: true
})
export const productModel = mongoose.model('product', productSchema) 