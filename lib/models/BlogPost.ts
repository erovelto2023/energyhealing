import mongoose, { Schema, Model } from 'mongoose';

export interface IBlogPost {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags: string[];
    isPublished: boolean;
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot be more than 300 characters']
    },
    coverImage: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export { BlogPost };
export default BlogPost;

