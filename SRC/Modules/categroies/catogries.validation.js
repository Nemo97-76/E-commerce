import joi from 'joi'
export const createCategorySchema={
    query:joi.object({
        name : joi.string().min(3).max(50).optional()
    }).required()
}

export const updateCategorySchema={
    query:joi.object({
        name:joi.string(),
        categoryId:joi.string()
    }).required()
}

export const deleteCategorySchema={
    query:joi.object({
        categoryId:joi.string().required()
    }).required()
}