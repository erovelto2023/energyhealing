import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import GlossaryTerm from '@/lib/models/GlossaryTerm';
import Product from '@/lib/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await connectToDatabase();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/glossary`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/marketplace`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/bookings`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Dynamic glossary terms
    const glossaryTerms = await GlossaryTerm.find({
        status: { $ne: 'draft' }
    }).select('slug id updatedAt').lean();

    const glossaryPages: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
        url: `${baseUrl}/glossary/${term.slug || term.id}`,
        lastModified: term.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic products/tools
    const products = await Product.find().select('slug id updatedAt').lean();

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/tools/${product.slug || product.id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...glossaryPages, ...productPages];
}
