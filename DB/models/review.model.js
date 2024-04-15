import { Schema, model } from 'mongoose'
export const reviewSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
        },
        reviewRate: {
            type: Number,
            enum: [1, 2, 3, 4, 5]
        },
        reviewComment: { String }
    }, {
    timestamps: true
}
)
export const reviewModel = model('review', reviewSchema)