import { orderModel } from '../../../DB/Models/order.model.js'
import { reviewModel } from '../../../DB/models/review.model.js'
import {productModel} from '../../../DB/models/product.model.js'
/*add review*/
export const addreview=async(req,res,next)=>{
    const userId=req.authUser._id
    const {productId}=req.query
    const {reviewRate,reviewComment}=req.body

    const ISValidProduct=await orderModel.findOne({userId,'products.productId':productId,orderStatus:'delivered'})
    if(!ISValidProduct){
        return next(new Error('product is not delivered yet',{cause:400}))
    }
    const reviewObject={
        userId,
        productId,
        reviewComment,
        reviewRate
    }
    const reviewDB= await reviewModel.create(reviewObject)
    if(!reviewDB){
        return next(new Error('fail to save in DB',{cause:400}))
    }
    const product=await productModel.findOne({productId})
    const reviews=await reviewModel.find({productId})
    let sumRates=0
    for (const review of reviews) {
        sumRates+=review.reviewRate
    }
    product.rate=Number(sumRates/reviews.length).toFixed(2)
    await product.save()
    res.Status(200).json({
        message:'review Added',
        reviewDB,product
    })
}
/*update revirew*/
export const updateReview=async(req,res,next)=>{
    const userId=req.authUser._id
    const {reviewId,productId}=req.query
    const {reviewRate,reviewComment}=req.body
    const isreviewExsit= await reviewModel.findOne({_id:reviewId,productId,userId})
    if(!isreviewExsit){
        return next(new Error('invalid id',{cause:400}))
    }
    reviewRate?isreviewExsit.reviewRate=reviewRate:isreviewExsit.reviewRate=isreviewExsit.reviewRate
    const product=await productModel.findOne({productId})
    const reviews=await reviewModel.find({productId})
    let sumRates=0
    for (const review of reviews) {
        sumRates+=review.reviewRate
    }
    product.rate=Number(sumRates/reviews.length).toFixed(2)
    reviewComment?isreviewExsit.reviewComment=reviewComment:isreviewExsit.reviewComment=isreviewExsit.reviewComment
     await isreviewExsit.save()
     res.status(200).json({
        message:'your review was updated',
        isreviewExsit
     })

}
/*delete review*/
export const deleteReview=async(req,res,next)=>{
    const userId=req.authUser._id
    const {reviewId,productId}=req.query
    const isreviewExsit= await reviewModel.findOneAndDelete({_id:reviewId,productId,userId})
    if(!isreviewExsit){
        return next(new Error('invalid id',{cause:400}))
    }
    res.status(200).json({
        message:"your review was deleted"
    })
}