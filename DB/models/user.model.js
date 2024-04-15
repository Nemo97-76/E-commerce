import mongoose, {Schema} from "mongoose";
export const userSchema= new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    }
    ,email:{
        type: String,
        lowercase:true,
        required:true
    }
    ,password:{
        type:String,
        minlength:[8,"Password should be at least 8 characters long"],
    }
    ,age:Number
    ,gender:{
        type:String,
        enum :["male","female"],
    },
    phone:{
        type:Number,
    },
    isConfirmed:{
        type:Boolean,
        default:false,
    },
    isDeleted:Boolean,
    isOnline:Boolean,
    deletedAt:Date,
    profilePic:{
        public_id:String,
        secure_url:String
    } ,
    role:{
        type:String,
        enum:['Admin','User'],
        default:'user'
    }
    ,status:{
type:String,
enum:['offline','online'],
default:"offline"
    }  ,
    address:{
        type:String,
        required:true
    }
},{
    timestamps: true
}
)
export const userModel=mongoose.model('user',userSchema)