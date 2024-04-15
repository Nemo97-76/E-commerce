import joi from'joi'
import {generalFields} from '../../middlewares/validation.js'
export const createOrderSchema={
    body:joi.object({
        address:joi.string().required(),
        phoneNumbers:joi.array().items(joi.string().required()).required(),
        productId:generalFields._id.required(),
        quantity:joi.number().positive().integer().min(1).required(),
        paymentMethod:joi.string().required(),
        couponCode:joi.string().optional()
    }).required(),
    headers:joi.object({
        authorization:joi.string().required()
    }).required().unknown()
 } 
 