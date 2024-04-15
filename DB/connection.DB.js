import mongoose from "mongoose";
export const ConnectionDB= async ()=>{
    return await mongoose.connect(`mongodb://127.0.0.1:27017/E-commerce`)
    .then((res)=>console.log('DB connected successfully'))
    .catch((err)=> console.log('connection faild',err))
}
