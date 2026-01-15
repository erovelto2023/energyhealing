import { Star } from 'lucide-react';

export const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-0.5 text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < Math.round(rating) ? "currentColor" : "none"}
                className={i < Math.round(rating) ? "" : "text-gray-300"}
            />
        ))}
        <span className="text-xs text-slate-500 ml-1 font-medium">{rating}</span>
    </div>
);
