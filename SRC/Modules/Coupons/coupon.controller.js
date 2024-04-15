import { coponModel } from '../../../DB/models/Coupon.model.js'
import { productModel } from '../../../DB/models/product.model.js'
import { userModel } from '../../../DB/Models/user.model.js'
/*add coupon*/
export const AddCoupon = async (req, res, next) => {
    const { _id } = req.authUser
    const { couponCode,
        couponAmount,
        isPercentage,
        isFixedAmount,
        fromDate,
        toDate,
        couponAssginedToUsers,
        couponAssginedToProduct
    } = req.body
    const PRODUCT=await productModel.findOne({_id:{$in:[couponAssginedToProduct]}})
    PRODUCT?true:next(new Error('invalid id', { cause: 400 }))
    const IsDoublicated = await coponModel.findOne({ couponCode })
    if (IsDoublicated) {
        return next(new Error('duplicate coupon code,please enter a different coupon code', { cause: 400 }))
    }
    if (!isFixedAmount && !isPercentage || (isFixedAmount && isPercentage)) {
        return next(
            new Error('please select if the coupon is percentage or fixedAmount', {
                cause: 400,
            }))
    }
    let UserARR=[]
    for (const userID of couponAssginedToUsers) {
     let  finder=  await userModel.find({_id:userID})
     finder?UserARR.push(userID):next(new Error({cause:400}))
    }
    const couponObject = {
        couponCode,
        couponAmount,
        isPercentage,
        isFixedAmount,
        fromDate,
        toDate,
        couponAssginedToUsers,
        couponAssginedToProduct,
        createdBy: req.authUser._id,
    }
    const CouponDB = await coponModel.create(couponObject)
    if (!CouponDB) {
        return next(new Error('fail to add coupon', { cause: 400 }))
    }
    res.status(200).json({ message: "coupon was added", CouponDB })
}
/*delete coupon*/
export const deleteCoupon = async (req, res, next) => {
    const { _id } = req.authUser
    const { couponCode } = req.params
const conponExist= await coponModel.findOneAndDelete({couponCode,createdBy:_id})
    res.status(200).json({ message: 'deleted' })
}
/*update coupon*/
export const updateCoupon = async (req, res, next) => {
    const { couponCode } = req.query
    const {
        fromDate,
        toDate,
        couponAmount
    } = req.body
    const coupon = await coponModel.findOne({ couponCode })
    if (!coupon) {
        return next(new Error('invalid Coupon code', { cause: 400 }))
    }
    if (fromDate || toDate) {
        if (coupon.toDate == toDate || coupon.fromDate == fromDate) {
            return next(new Error('please enter different Date', { cause: 400 }))
        }
        coupon.toDate = toDate
        coupon.fromDate = fromDate
    }
    if(couponAmount){
        if(coupon.couponAmount==couponAmount){
            return next(new Error('this the same amount',{cause:400}))
        }
        coupon.couponAmount=couponAmount
    }
    await coupon.save()
    res.status(200).json({
        message: "coupon was updated",
        coupon
    })
}

