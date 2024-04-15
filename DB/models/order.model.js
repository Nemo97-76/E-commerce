import mongoose, { Schema, model } from "mongoose";

const orderSchema=Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    products:[
        {
            productId: {
              type: Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
            },
            title: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
          }
    ],
    subTotal:{
        type:Number,
        required:true,
        default:0
    },
    couponId:{
        type:Schema.Types.ObjectId,
        ref:"Coupon"
    },
    paidAmount:{
        type:Number,
        required:true,
        default:0
    },
    address:{
        type:String,
        required:true
    },
    phoneNumbers:[{type:String,required:true}],
    orderStatus: {
        type: String,
        enum: [
          'placed',
          'on way',
          'confirmed',
          'delivered',
          'pending',
          'canceled',
          'rejected',
        ],
      },
      paymentMethod:{
        type:String,
        enum:['cash',"card"],
        required:true
      },
      canceledBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
      },
      updatedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
},{
    timestamps: true,
})

export const orderModel =mongoose.model('order',orderSchema)