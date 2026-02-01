import React from 'react';
import { getAffirmations } from '@/lib/actions';
import { Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import AffirmationsList from '@/components/features/AffirmationsList';
import HeroSlideshow, { HeroContent } from '@/components/features/HeroSlideshow';
import path from 'path';
import fs from 'fs';

const AFFIRMATIONS_HERO_CONTENT: HeroContent[] = [
    { title: "Words That Heal. Rituals That Ground.", subtitle: "Daily somatic practices to regulate your nervous system.", category: "Daily Rituals" },
    { title: "Rewire Your Beliefs", subtitle: "Transform your inner dialogue with intention and awareness.", category: "Mindset" },
    { title: "Embody Your Truth", subtitle: "Connect deeply with your body's wisdom and innate worth.", category: "Somatic Healing" },
    { title: "Healing Through Intention", subtitle: "Powerful affirmations to guide your journey back to balance.", category: "Empowerment" },
    { title: "Cultivate Inner Peace", subtitle: "Simple, profound practices for a calm and centered mind.", category: "Wellness" }
];

export const metadata: Metadata = {
    title: 'Daily Rituals & Affirmations | Kathleen Heals',
    description: 'A collection of somatic affirmations, daily rituals, and herbal pairings to regulate your nervous system and expand your worth.',
};

export default async function AffirmationsPage() {
    const affirmations = await getAffirmations();

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
        <div className="min-h-screen bg-slate-50 font-sans">
            <HeroSlideshow images={heroImages} content={AFFIRMATIONS_HERO_CONTENT} />

            <AffirmationsList initialAffirmations={affirmations} />
        </div>
    );
}
