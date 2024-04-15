import { coponModel} from "../../DB/models/Coupon.model.js";
import moment from "moment-timezone";
export const couponValidationFunction=async({
    couponCode,userId,next
}={})=>{
    const coupon=await coponModel.findOne({
        couponCode
    })
    if(!coupon){
        return{
            message:"please enter a valid couponCode"
        }
    }
    if(coupon.couponStatus=='Expired'||moment(new Date(coupon.toDate)).isBefore(moment().tz('Africa/Cairo'))){
        return{
            message:"the coupon is expired"
        }
    }
    if(coupon.couponStatus=="Valid"&&moment().isBefore(moment(new Date(coupon.fromDate)).tz('Africa/Cairo'))){
        return{
            message:"the coupon is expired"
        }
    }
    let notAssginedusers = []
    let exceedMaxCount = false
    for (const user of coupon.couponAssginedToUsers) {
        notAssginedusers.push(user.userId.toString())
        if(userId.toString()==user.userId.toString()){
            if (user.maxUsage<=user.usageCount) {
                exceedMaxCount=true
            }
        }
    }
    if(!notAssginedusers.includes(userId.toString())){
        return{
            notAssgined:true,
            message:'this coupon is not assigned to you'
        }
    }
    if(exceedMaxCount){
        return{
            exceedMaxCount:true,
            message:"you have retched your max. usage"
        }
    }
return true
}