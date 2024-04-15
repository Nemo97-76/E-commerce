import mongoose, { Schema } from "mongoose";


const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    products:
      [{
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        }, quantity: {
          type: Number,
          required: true,
        }
      }],
    subTotal: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true },
)

export const cartModel = mongoose.model('Cart', cartSchema)