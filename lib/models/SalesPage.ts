import mongoose, { Schema, Model } from 'mongoose';

export interface ISalesPage {
    id: string;
    slug: string;
    title: string;
    content?: string;
}

const SalesPageSchema = new Schema<ISalesPage>({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String },
});

const SalesPage: Model<ISalesPage> = mongoose.models.SalesPage || mongoose.model<ISalesPage>('SalesPage', SalesPageSchema);

export default SalesPage;
