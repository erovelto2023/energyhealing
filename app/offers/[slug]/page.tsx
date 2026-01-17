import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Offer from '@/lib/models/Offer';
import { Metadata } from 'next';

interface Props {
    params: { slug: string };
}

// Force dynamic rendering so new offers appear instantly without build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        await connectToDatabase();
        const offer = await Offer.findOne({ slug: params.slug });
        if (!offer) return { title: 'Offer Not Found' };
        return {
            title: offer.title,
            description: offer.description || `Special offer: ${offer.title}`,
        };
    } catch (e) {
        return { title: 'Offer Page' };
    }
}

export default async function OfferPage({ params }: Props) {
    await connectToDatabase();

    // Fetch and increment view count
    const offer = await Offer.findOneAndUpdate(
        { slug: params.slug },
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!offer) {
        notFound();
    }

    return (
        // Render the stored HTML content safely
        // Note: This relies on the content being standard HTML/Tailwind.
        // React components (e.g. <Star />) stored in DB will NOT render unless they are SVGs.
        <div
            className="min-h-screen w-full bg-slate-50"
            dangerouslySetInnerHTML={{ __html: offer.content }}
        />
    );
}
