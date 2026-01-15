import mongoose, { Schema, Model } from 'mongoose';

export interface IModuleItem {
    type: 'glossary' | 'tool';
    itemId: string; // ID of the GlossaryTerm or Product (string or number, stored as string here for flexibility)
    title: string; // Override title or cache it
}

export interface ILearningPath {
    id: string; // "lp-seo-basics"
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    modules: IModuleItem[];
}

const LearningPathSchema = new Schema<ILearningPath>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    modules: [{
        type: { type: String, enum: ['glossary', 'tool'] },
        itemId: { type: String },
        title: { type: String }
    }]
});

const LearningPath: Model<ILearningPath> = mongoose.models.LearningPath || mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);

export default LearningPath;
