
import mongoose, { Schema, Document } from "mongoose";

export interface IHerb extends Document {
    id: string;
    name: string;
    slug: string;
    category: string;
    healing: string[];
    description: string;
    physical: string;
    emotional: string;
    benefits: string;
    usage: string;
    image?: string;
    recommendedProducts: {
        productId: string;
        note?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const HerbSchema = new Schema<IHerb>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    healing: { type: [String], default: [] },
    description: { type: String, required: true },
    physical: { type: String },
    emotional: { type: String },
    benefits: { type: String },
    usage: { type: String },
    image: { type: String },
    recommendedProducts: [{
        productId: { type: String, required: true },
        note: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Herb || mongoose.model<IHerb>("Herb", HerbSchema);
