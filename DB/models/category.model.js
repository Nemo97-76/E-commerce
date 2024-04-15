import mongoose, {Schema} from "mongoose";
export const categorySchema=new Schema({
    CustomId:String,
    name:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    slug:{
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    Image: {
        secure_url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: true
        }
    }
    ,
    AddedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        //ref to user ID ,user schema
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
},{
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true },
    timestamps:true
})
categorySchema.virtual('subCategories', {
    ref: 'subCategory',
    foreignField: 'categoryId',
    localField: '_id',
  })
export const categoryModel=mongoose.model('Category',categorySchema)