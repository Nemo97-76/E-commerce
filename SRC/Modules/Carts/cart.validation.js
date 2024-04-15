import Joi from "joi";
export const addToCartSchema={
    body:Joi.object({
        productId:Joi.string().required(),
        quantity:Joi.number().required()
    }).required(),
}
export const deleteFromCartSchema={
    body:Joi.object({
        productId:Joi.string().required()
    }).required()
}
