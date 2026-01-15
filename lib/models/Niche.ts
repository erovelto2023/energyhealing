import mongoose, { Schema, Model } from 'mongoose';

export interface INiche {
    id: string; // "n-indoor-gardening"
    name: string; // "Indoor Gardening"
    slug: string;
    description: string;
    profitability: 'Low' | 'Medium' | 'High' | 'Very High';
    competition: 'Low' | 'Medium' | 'High' | 'Very High';
    monetizationMethods: string[]; // ["Amazon Associates", "Courses"]
    keywords: string[]; // ["grow lights", "hydroponics"]
    potentialMonthlyRevenue?: string; // "$1k - $10k"
    recommendedToolIds?: number[]; // Tools good for this niche
}

const NicheSchema = new Schema<INiche>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    profitability: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'Medium' },
    competition: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'Medium' },
    monetizationMethods: [String],
    keywords: [String],
    potentialMonthlyRevenue: { type: String },
    recommendedToolIds: [Number]
});

const Niche: Model<INiche> = mongoose.models.Niche || mongoose.model<INiche>('Niche', NicheSchema);

export default Niche;
