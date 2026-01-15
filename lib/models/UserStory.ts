import mongoose, { Schema, Model } from 'mongoose';

export interface IUserStory {
    id: string;
    authorName: string;
    authorInitials?: string; // e.g., "J.D." for privacy
    email?: string; // For admin verification, not displayed publicly
    title: string; // e.g., "My Journey with Chronic Pain"
    story: string; // Full story text (markdown supported)

    // Story Context
    painType?: string; // e.g., "Chronic back pain", "Migraines", "Anxiety"
    duration?: string; // e.g., "5 years", "Since childhood"
    whatHelped?: string; // What they've tried that helped
    whatDidntHelp?: string; // What they've tried that didn't work
    currentStatus?: string; // e.g., "Still searching", "Managing", "Healed"

    // Categorization
    category?: string; // e.g., "Physical Pain", "Emotional Healing", "Spiritual Journey"
    tags?: string[]; // e.g., ["chronic-pain", "back-pain", "hope"]

    // Moderation
    featured?: boolean; // Show on featured stories page
    approved?: boolean; // Admin approval

    // Metadata
    location?: string; // City, State (optional)
    age?: string; // Age or age range (optional)

    createdAt?: Date;
    updatedAt?: Date;
}

const UserStorySchema = new Schema<IUserStory>({
    id: { type: String, required: true, unique: true },
    authorName: { type: String, required: true },
    authorInitials: { type: String },
    email: { type: String },
    title: { type: String, required: true },
    story: { type: String, required: true },

    painType: { type: String },
    duration: { type: String },
    whatHelped: { type: String },
    whatDidntHelp: { type: String },
    currentStatus: { type: String },

    category: { type: String },
    tags: [String],

    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },

    location: { type: String },
    age: { type: String },
}, {
    timestamps: true
});

const UserStory: Model<IUserStory> = mongoose.models.UserStory || mongoose.model<IUserStory>('UserStory', UserStorySchema);

export default UserStory;
