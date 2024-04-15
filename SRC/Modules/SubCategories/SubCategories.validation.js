import joi from 'joi'
export const AddSubCatSchema={
    query:joi.object({
        name:joi.string().min(5).max(55),
        categoryId:joi.string().required()
    }).required().options({presence:'required'}),
}
export const updateSubCateSchema={
    query:joi.object({
        name:joi.string().min(5).max(55),
        subcategoryID:joi.string().required()
    }).required()
}
export const deleteSubCateSchema={
    query:joi.object({
        subcategoryID:joi.string().required() 
    })
}