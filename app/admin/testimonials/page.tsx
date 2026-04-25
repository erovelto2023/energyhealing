import { Metadata } from 'next';
import TestimonialReviewDashboard from '@/components/admin/TestimonialReviewDashboard';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata: Metadata = {
    title: 'Review Testimonials | Admin',
    description: 'Review and approve client testimonials',
};

export default function AdminTestimonialsPage() {
    return (
        <AdminGuard>
            <TestimonialReviewDashboard />
        </AdminGuard>
    );
}
