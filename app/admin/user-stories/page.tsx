import { Metadata } from 'next';
import UserStoryReviewDashboard from '@/components/admin/UserStoryReviewDashboard';

export const metadata: Metadata = {
    title: 'Review User Stories | Admin',
    description: 'Review and approve community healing stories',
};

export default function AdminUserStoriesPage() {
    return <UserStoryReviewDashboard />;
}
