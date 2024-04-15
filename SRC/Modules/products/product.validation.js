import Joi from "joi";
export const addproductSchema={
    query:Joi.object({
        title:Joi.string().min(5).max(55).required(),
        desc:Joi.string().min(5).max(500).optional(),
        price:Joi.number().positive().min(1).required(),
        appliedDiscount:Joi.number().positive().min(1).max(100).optional(),
        colors:Joi.array().items(Joi.string().required()).optional(),
        sizes:Joi.array().items(Joi.string().required()).optional(),
        stock:Joi.number().integer().positive().min(1).required(),       categoryId:Joi.string().required(),
        categoryId:Joi.string().required(),
        SubCategoryId:Joi.string().required(),
        brandId:Joi.string().required(),
    }).options({presence:'required'})
}


export const updateproductSchema={
    query:Joi.object({
        productId:Joi.string().required(),
        categoryId:Joi.string().required(),
        SubCategoryId:Joi.string().required(),
        brandId:Joi.string().required(),
        title:Joi.string().min(5).max(55),
        desc:Joi.string().min(5).max(500).optional(),
        price:Joi.number().positive().min(1),
        appliedDiscount:Joi.number().positive().min(1).max(100).optional(),
        colors:Joi.array().items(Joi.string().required()).optional(),
        sizes:Joi.array().items(Joi.string().required()).optional(),
        stock:Joi.number().integer().positive().min(1)
    }).options({presence:'required'})
}


export const deleteProductSchema={
qury:Joi.object({
    productId:Joi.string().required()
}).options({presence:'required'})
}