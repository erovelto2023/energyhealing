import mongoose, { Schema, Model } from 'mongoose';

export interface IQuestion {
    productId: number; // Links to Product ID
    user: string; // User name or ID
    userId?: string; // Optional auth ID
    question: string;
    answer?: string; // Answer from admin/community
    isAnswered: boolean;
    date: Date;
    upvotes: number;
}

const QuestionSchema = new Schema<IQuestion>({
    productId: { type: Number, required: true },
    user: { type: String, required: true },
    userId: { type: String },
    question: { type: String, required: true },
    answer: { type: String },
    isAnswered: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    upvotes: { type: Number, default: 0 }
});

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
