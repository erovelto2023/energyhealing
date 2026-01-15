import mongoose, { Schema, Model } from 'mongoose';

export interface ISearchLog {
    query: string;
    count: number;
    lastSearched: Date;
    resultsCount: number; // 0 implies "no results" found
}

const SearchLogSchema = new Schema<ISearchLog>({
    query: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    lastSearched: { type: Date, default: Date.now },
    resultsCount: { type: Number, required: true }
});

const SearchLog: Model<ISearchLog> = mongoose.models.SearchLog || mongoose.model<ISearchLog>('SearchLog', SearchLogSchema);

export default SearchLog;
