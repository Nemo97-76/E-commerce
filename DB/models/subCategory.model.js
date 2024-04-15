import mongoose, {Schema} from "mongoose";
export const SubCategorySchema=new Schema({
    CustomId:String,
    name:{
        type:String,
        unique:true,
        required:true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
      },
      Image: {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
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
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      }
},{
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true },
    timestamps:true
})
SubCategorySchema.virtual('Brands', {
    ref: 'Brand',
    foreignField: 'CustomId',
    localField: '_id',
  })
export const SubCategoryModel=mongoose.model('SubCategory',SubCategorySchema)