import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";
export const addCouponSchema={
    body:Joi.object({
        couponCode: Joi.string().min(3).max(5).required(),
        couponAmount: Joi.number().positive().min(1).max(100).required(),
        isPercentage: Joi.boolean().optional(),
        isFixedAmount: Joi.boolean().optional(),
        fromDate: Joi.date()
          .greater(Date.now() - 24 * 60 * 60 * 1000)
          .required(),
        toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
        couponAssginedToUsers: Joi.optional(),
        couponAssginedToProduct: Joi.array().items(Joi.string()).optional(),
    }).required()
}

export const deleteCouponSchema = {
    params: Joi.object({
        couponCode:Joi.string().required()
    }).required()
  }
export const updateCouponSchema={
    body:Joi.object({
        fromDate:Joi.date().greater(Date.now()-24*60*60*1000).optional(),
        toDate:Joi.date().greater(Joi.ref('fromDate')).optional(),
        couponAmount:Joi.number().positive().optional()
    }).required()
}
