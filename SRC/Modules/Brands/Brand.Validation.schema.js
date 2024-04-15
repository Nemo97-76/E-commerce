import joi from 'joi'
export const createBrandSchema={
    query:joi.object({
        name:joi.string().min(5).max(60),
        SubCategoryId:joi.string().required(),
        categoryId:joi.string().required(),
    }).required().options({presence:"required"})
}
export const updateBrandSchema={
    body:joi.object({
        name:joi.string().min(5).max(55).optional()
    }).required()
}
export const deleteBrandSchema={
    query:joi.object({
        SubCategoryId:joi.string().required(),
        BrandId:joi.string().required(),
        categoryId:joi.string().required()
    }).required()
}