import mongoose , {Schema} from 'mongoose'
export const BrandSchema= new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },
    slug:{
        type: String,
      unique: true,
      lowercase: true,
    },
    logo:{
        secure_url:{
            type: String,
        },
        public_id: {
            type: String,
          }
    },
    categoryId:{
        type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    SubCategoryId:{
        type:Schema.Types.ObjectId,
        ref:"SubCategory",
        //ref to subCategory ID,Subcategory schema
    }
    ,
    CustomId:String,
    AddedBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        //ref to owner ID ,onwer schema
    }
},{
    timestamps:true
})
export const BrandModel=mongoose.model('Brand',BrandSchema)