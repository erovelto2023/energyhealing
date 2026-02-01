import { getGlossaryTerms } from '@/lib/initialData';
import GlossaryList from '@/components/features/GlossaryList';
import HeroSlideshow, { HeroContent } from '@/components/features/HeroSlideshow';
import path from 'path';
import fs from 'fs';

const GLOSSARY_HERO_CONTENT: HeroContent[] = [
    { title: "The Language of Healing", subtitle: "Understanding the terms that shape your journey.", category: "Glossary" },
    { title: "Decode the Wisdom of Energy", subtitle: "A comprehensive guide to holistic concepts.", category: "Knowledge Base" },
    { title: "Deepen Your Understanding", subtitle: "Clarity for your spiritual and healing path.", category: "Education" },
    { title: "Words That Resonate", subtitle: "Find the meaning behind the feeling.", category: "Insight" },
    { title: "A Dictionary for Wellness", subtitle: "Connecting modern minds with ancient wisdom.", category: "Resources" }
];

export default async function GlossaryPage({ searchParams }: { searchParams: Promise<{ q?: string; niche?: string; page?: string; letter?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const { q, niche, page, letter } = resolvedSearchParams;
    const { terms, totalPages, currentPage } = await getGlossaryTerms({ search: q, niche, page, letter, limit: 15 });

    const isHealing = niche === "Energy Healing";

    const heroImagesDir = path.join(process.cwd(), 'public/images/hero-slideshow');
    let heroImages: string[] = [];
    try {
        const files = fs.readdirSync(heroImagesDir);
        heroImages = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
            .map(file => `/images/hero-slideshow/${file}`);
    } catch (error) {
        console.error("Error reading hero images:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <HeroSlideshow images={heroImages} content={GLOSSARY_HERO_CONTENT} />

            <GlossaryList
                terms={terms}
                initialTotalPages={totalPages}
                initialPage={currentPage}
            />
        </div>
    );
}
