import mongoose, { Schema, Model } from 'mongoose';

export interface ILearningPath {
    id: string;
    title: string;
    description?: string;
}

const LearningPathSchema = new Schema<ILearningPath>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
});

const LearningPath: Model<ILearningPath> = mongoose.models.LearningPath || mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);

export default LearningPath;
