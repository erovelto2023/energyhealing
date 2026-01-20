import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAffirmation extends Document {
    id: string;
    title: string;
    slug: string;
    affirmation: string;
    intention: string;
    category: string;
    whenToUse: string[];
    whyItWorks: string;
    userPrompt: string;

    // Pairing Object
    pairing: {
        herbs: string[];
        rituals: string[];
        breathwork: string;
        moonPhase: string;
    };

    // Relationships
    linkedGlossaryTerms: string[]; // Store names or IDs depending on preference, sticking to strings for flexibility
    recommendedProductIds: string[]; // Store product IDs as strings or numbers, flexible
    primaryHerb: string; // Name of the herb

    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AffirmationSchema = new Schema<IAffirmation>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    affirmation: { type: String, required: true },
    intention: { type: String, required: true },
    category: { type: String, required: true },
    whenToUse: { type: [String], default: [] },
    whyItWorks: { type: String },
    userPrompt: { type: String },

    pairing: {
        herbs: { type: [String], default: [] },
        rituals: { type: [String], default: [] },
        breathwork: { type: String },
        moonPhase: { type: String }
    },

    linkedGlossaryTerms: { type: [String], default: [] },
    recommendedProductIds: { type: [String], default: [] },
    primaryHerb: { type: String },

    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create compound index for search
AffirmationSchema.index({ title: 'text', affirmation: 'text', intention: 'text' });

const Affirmation: Model<IAffirmation> = mongoose.models.Affirmation || mongoose.model<IAffirmation>('Affirmation', AffirmationSchema);

export default Affirmation;
