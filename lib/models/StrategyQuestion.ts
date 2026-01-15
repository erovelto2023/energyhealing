import mongoose, { Schema, Model } from 'mongoose';

export interface IStrategyQuestion {
    id: string;
    step: number;
    question: string;
    description?: string;
}

const StrategyQuestionSchema = new Schema<IStrategyQuestion>({
    id: { type: String, required: true, unique: true },
    step: { type: Number, required: true },
    question: { type: String, required: true },
    description: { type: String },
});

const StrategyQuestion: Model<IStrategyQuestion> = mongoose.models.StrategyQuestion || mongoose.model<IStrategyQuestion>('StrategyQuestion', StrategyQuestionSchema);

export default StrategyQuestion;
