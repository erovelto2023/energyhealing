import mongoose, { Schema, Model } from 'mongoose';

export interface ISearchLog {
    query: string;
    timestamp: Date;
}

const SearchLogSchema = new Schema<ISearchLog>({
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const SearchLog: Model<ISearchLog> = mongoose.models.SearchLog || mongoose.model<ISearchLog>('SearchLog', SearchLogSchema);

export default SearchLog;
