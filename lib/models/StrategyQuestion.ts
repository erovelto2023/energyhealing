import mongoose, { Schema, Model } from 'mongoose';

export interface IStrategyOption {
    label: string;
    value: string;
    // Map answer to product fields directly, e.g. { "priceModel": "Free", "niche": "SEO" }
    // This allows flexible filtering logic on the frontend/backend when processing answers.
    filters?: Record<string, string | string[] | boolean | number>;
}

export interface IStrategyQuestion {
    id: string; // "q1", "q2"
    step: number; // 1, 2, 3...
    question: string;
    description?: string; // Helper text
    type: 'single' | 'multiple';
    options: IStrategyOption[];
}

const StrategyQuestionSchema = new Schema<IStrategyQuestion>({
    id: { type: String, required: true, unique: true },
    step: { type: Number, required: true },
    question: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['single', 'multiple'], default: 'single' },
    options: [{
        label: { type: String, required: true },
        value: { type: String, required: true },
        filters: { type: Schema.Types.Mixed } // Flexible JSON object
    }]
});

const StrategyQuestion: Model<IStrategyQuestion> = mongoose.models.StrategyQuestion || mongoose.model<IStrategyQuestion>('StrategyQuestion', StrategyQuestionSchema);

export default StrategyQuestion;
