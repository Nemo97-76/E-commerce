import mongoose, {Schema} from "mongoose";
export const coponSchema= new Schema({
   couponCode: {
      type: String,
      required: true,
      lowercase: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFixedAmount: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    couponStatus: {
      type: String,
      default: 'Valid',
      enum: ['Valid', 'Expired'],
    },
     couponAssginedToUsers: [
{     userId:{ 
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    usageCount:Number,
    maxUsage:{type:Number,default:1}
  }
    ], 
    couponAssginedToProduct: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  }, 
  {
timestamps:true
})
export const coponModel=mongoose.model('copon',coponSchema)