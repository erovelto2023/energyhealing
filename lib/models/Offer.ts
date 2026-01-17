import mongoose, { Schema, Model } from 'mongoose';

export interface IOffer {
    title: string;
    slug: string;
    content: string; // Stored HTML/Content
    description?: string;
    isPublished: boolean;
    showInMarketplace: boolean;
    views: number;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    description: { type: String },
    isPublished: { type: Boolean, default: true },
    showInMarketplace: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Prevent model recompilation error
const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
