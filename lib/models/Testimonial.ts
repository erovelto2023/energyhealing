import mongoose, { Schema, Model } from 'mongoose';

export interface ITestimonial {
    id: string;
    clientName: string;
    clientInitials?: string; // e.g., "S.M." for privacy
    clientPhoto?: string; // URL to photo (optional)
    email?: string; // For admin verification, not displayed publicly
    rating: number; // 1-5 stars
    testimonialText: string;
    issue?: string; // What they came in with (e.g., "Chronic back pain")
    outcome?: string; // What improved (e.g., "80% reduction in pain")
    sessionType?: string; // e.g., "Reiki", "Energy Healing"
    date?: Date;
    featured?: boolean; // Show on homepage
    approved?: boolean; // Admin approval
    location?: string; // e.g., "New York, NY"
    createdAt?: Date;
    updatedAt?: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
    id: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    clientInitials: { type: String },
    clientPhoto: { type: String },
    email: { type: String }, // For admin verification
    rating: { type: Number, required: true, min: 1, max: 5 },
    testimonialText: { type: String, required: true },
    issue: { type: String },
    outcome: { type: String },
    sessionType: { type: String },
    date: { type: Date },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    location: { type: String },
}, {
    timestamps: true
});

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
