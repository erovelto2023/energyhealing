import mongoose, { Schema, Model } from 'mongoose';

export interface ISuccessStory {
    id: string;
    slug: string;
    title: string; // e.g., "From Chronic Pain to Freedom"
    clientName: string; // Can be "Anonymous" or initials
    clientPhoto?: string;

    // Story Structure
    initialIssue: string; // Detailed description of the problem
    healingApproach: string; // What methods were used
    glossaryTermsUsed: string[]; // IDs of related glossary terms
    outcome: string; // The result/transformation
    timeline?: string; // e.g., "3 months", "6 sessions"

    // Rich Content
    fullStory?: string; // Markdown supported
    beforePhoto?: string;
    afterPhoto?: string;
    quote?: string; // Pull quote for highlights

    // Metadata
    category?: string; // e.g., "Pain Relief", "Emotional Healing"
    tags?: string[];
    featured?: boolean;
    publishedAt?: Date;
    status?: 'draft' | 'published' | 'archived';

    // SEO
    metaTitle?: string;
    metaDescription?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    clientPhoto: { type: String },

    initialIssue: { type: String, required: true },
    healingApproach: { type: String, required: true },
    glossaryTermsUsed: [String],
    outcome: { type: String, required: true },
    timeline: { type: String },

    fullStory: { type: String },
    beforePhoto: { type: String },
    afterPhoto: { type: String },
    quote: { type: String },

    category: { type: String },
    tags: [String],
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },

    metaTitle: { type: String },
    metaDescription: { type: String },
}, {
    timestamps: true
});

const SuccessStory: Model<ISuccessStory> = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;
