import { getGlossaryTerm, getGlossaryTerms } from '@/lib/initialData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GlossaryTermLayout from '@/components/features/GlossaryTermLayout';
import GlossaryTerm from '@/lib/models/GlossaryTerm';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const term = await getGlossaryTerm(resolvedParams.id);

    if (!term) return { title: 'Term Not Found' };

    // Enhanced SEO with schema.org markup
    return {
        title: term.metaTitle || `${term.term} - Healing Dictionary | Kathleen Heals`,
        description: term.metaDescription || term.shortDefinition?.slice(0, 160) || `Learn about ${term.term}, its meaning, and applications in energy healing.`,
        keywords: term.keywords || [term.term, "Energy Healing", "Glossary", "Definition", term.category].filter(Boolean),
        openGraph: {
            title: term.term,
            description: term.shortDefinition,
            type: 'article',
        },
        alternates: {
            canonical: `/glossary/${term.slug || term.id}`
        }
    };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const term = await getGlossaryTerm(resolvedParams.id);

    if (!term) {
        notFound();
    }

    const serializedTerm = JSON.parse(JSON.stringify(term));

    // Fetch related products
    let relatedProducts = [];
    if (term.recommendedTools && term.recommendedTools.length > 0) {
        const productIds = term.recommendedTools.map((t: any) => t.productId);
        const { getProducts } = await import('@/lib/initialData');
        const { products } = await getProducts({ ids: productIds });
        relatedProducts = products;
    }

    // Fetch related glossary terms
    let relatedTerms = [];
    if (term.relatedTermIds && term.relatedTermIds.length > 0) {
        const relatedDocs = await GlossaryTerm.find({
            id: { $in: term.relatedTermIds }
        }).select('id term slug category shortDefinition').lean();
        relatedTerms = JSON.parse(JSON.stringify(relatedDocs));
    }

    return (
        <GlossaryTermLayout
            term={serializedTerm}
            relatedProducts={relatedProducts}
            relatedTerms={relatedTerms}
        />
    );
}
