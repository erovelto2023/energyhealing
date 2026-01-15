import mongoose, { Schema, Model } from 'mongoose';

export interface IPendingReview {
    productId: number;
    productName: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

const PendingReviewSchema = new Schema<IPendingReview>({
    productId: { type: Number, required: true },
    productName: { type: String, required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true }
});

const PendingReview: Model<IPendingReview> = mongoose.models.PendingReview || mongoose.model<IPendingReview>('PendingReview', PendingReviewSchema);

export default PendingReview;
