import { Metadata } from 'next';
import CommentReviewDashboard from '@/components/admin/CommentReviewDashboard';

export const metadata: Metadata = {
    title: 'Review Comments | Admin',
    description: 'Review and approve story comments',
};

export default function AdminCommentsPage() {
    return <CommentReviewDashboard />;
}
