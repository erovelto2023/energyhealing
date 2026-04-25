import { Metadata } from 'next';
import UserStoryReviewDashboard from '@/components/admin/UserStoryReviewDashboard';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata: Metadata = {
    title: 'Review User Stories | Admin',
    description: 'Review and approve community healing stories',
};

export default function AdminUserStoriesPage() {
    return (
        <AdminGuard>
            <UserStoryReviewDashboard />
        </AdminGuard>
    );
}
