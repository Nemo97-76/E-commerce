import joi from 'joi'

export const addReviewSchema={
    body:joi.object({
        reviewRate:joi.number().min(1).max(5).optional(),
        reviewComment:joi.string().min(5).max(255).optional()
    }),
    query:joi.object({
        productId:joi.string().required()
    })
}
export const updateReviewSchema={
    query:joi.object({
        reviewId:joi.string().required(),
        productId:joi.string().required()
    }).required(),
    body:joi.object({
        reviewRate:joi.number().min(1).max(5).optional(),
        reviewComment:joi.string().optional()
    })
}
export const deleteReviewSchema={
    query:joi.object({
        reviewId:joi.string().required(),
        productId:joi.string().required()
    })
}

