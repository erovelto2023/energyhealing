import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IFAQ extends Document {
    question: string;
    slug: string;
    parentQuestion?: string;

    // Source/Reference Data
    linkTitle?: string;
    linkUrl?: string;
    sourceText?: string;

    // SEO & Content
    h1Title: string; // The "H1 Title" from the prompt
    answerSnippet: string; // The "Quick Answer" (40-60 words)

    // The Deep Dive
    deepDive: {
        problem?: string; // "The Problem"
        methodology?: string; // "The Science/Methodology"
        application?: string; // "The Practical Application"
    };

    // Navigation & Relationship
    relatedQuestions: string[]; // List of related question slugs or IDs
    relatedOfferId?: string; // Optional: Link to an Offer

    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
    question: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentQuestion: { type: String },

    linkTitle: { type: String },
    linkUrl: { type: String },
    sourceText: { type: String },

    h1Title: { type: String, required: true },
    answerSnippet: { type: String, required: true },

    deepDive: {
        problem: { type: String },
        methodology: { type: String },
        application: { type: String }
    },

    relatedQuestions: { type: [String], default: [] },
    relatedOfferId: { type: String },

    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for search
FAQSchema.index({ question: 'text', answerSnippet: 'text', h1Title: 'text' });
FAQSchema.index({ slug: 1 });

const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
