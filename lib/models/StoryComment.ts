import mongoose, { Schema, Model } from 'mongoose';

export interface IStoryComment {
    id: string;
    storyId: string; // Reference to user story
    authorName: string;
    email?: string; // For admin verification
    commentText: string;
    approved: boolean; // Admin approval
    createdAt?: Date;
    updatedAt?: Date;
}

const StoryCommentSchema = new Schema<IStoryComment>({
    id: { type: String, required: true, unique: true },
    storyId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    email: { type: String },
    commentText: { type: String, required: true },
    approved: { type: Boolean, default: false },
}, {
    timestamps: true
});

const StoryComment: Model<IStoryComment> = mongoose.models.StoryComment || mongoose.model<IStoryComment>('StoryComment', StoryCommentSchema);

export default StoryComment;
