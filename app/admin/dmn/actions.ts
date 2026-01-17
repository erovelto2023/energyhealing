"use server";

import connectToDatabase from '@/lib/db';
import Product from '@/lib/models/Product';
import GlossaryTerm from '@/lib/models/GlossaryTerm';
import Niche from '@/lib/models/Niche';
import PendingReview from '@/lib/models/PendingReview';
import { revalidatePath } from 'next/cache';

export async function clearAllData() {
    try {
        console.log('🗑️ Starting database clear...');
        await connectToDatabase();

        const productsDeleted = await Product.deleteMany({});
        console.log(`Deleted ${productsDeleted.deletedCount} products`);

        const termsDeleted = await GlossaryTerm.deleteMany({});
        console.log(`Deleted ${termsDeleted.deletedCount} glossary terms`);

        const nichesDeleted = await Niche.deleteMany({});
        console.log(`Deleted ${nichesDeleted.deletedCount} niches`);

        const reviewsDeleted = await PendingReview.deleteMany({});
        console.log(`Deleted ${reviewsDeleted.deletedCount} pending reviews`);

        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath('/glossary');
        revalidatePath('/niches');

        console.log('✅ Database cleared successfully!');
        return {
            success: true,
            message: `Cleared: ${productsDeleted.deletedCount} products, ${termsDeleted.deletedCount} terms, ${nichesDeleted.deletedCount} niches, ${reviewsDeleted.deletedCount} reviews`
        };
    } catch (error: any) {
        console.error('❌ Error clearing database:', error);
        return { error: error.message || "Failed to clear database" };
    }
}

export async function migrateToSlugs() {
    try {
        const { runSlugMigration } = await import('@/lib/migrateToSlugs');
        const result = await runSlugMigration();

        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath('/glossary');

        return result;
    } catch (error: any) {
        console.error('❌ Error running migration:', error);
        return { error: error.message || "Failed to run migration" };
    }
}

import fs from 'fs';
import path from 'path';
import Offer from '@/lib/models/Offer';

export async function importOffersFromFS() {
    try {
        await connectToDatabase();
        const offersDir = path.join(process.cwd(), 'app', 'offers');
        if (!fs.existsSync(offersDir)) return { success: false, error: "No offers dir" };

        const dirs = fs.readdirSync(offersDir).filter(f => {
            const fullPath = path.join(offersDir, f);
            return fs.statSync(fullPath).isDirectory() && !f.startsWith('[') && f !== 'api';
        });

        let count = 0;
        for (const slug of dirs) {
            const pagePath = path.join(offersDir, slug, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                let content = fs.readFileSync(pagePath, 'utf-8');

                // Cleanup content: Remove TS Import/Exports if possible or just warn
                // For now, we wrap it in a pre tag or comment so it's visible but safe-ish
                // Actually, if we just mistakenly render code as HTML, it's messy but not fatal.

                const existing = await Offer.findOne({ slug });
                if (!existing) {
                    await Offer.create({
                        title: slug,
                        slug,
                        content: content, // Saving raw code. User must edit later.
                        isPublished: true,
                        createdAt: fs.statSync(pagePath).birthtime
                    });
                    count++;
                }
            }
        }

        revalidatePath('/admin');
        return { success: true, count, message: `Imported ${count} offers from file system.` };
    } catch (error: any) {
        console.error('Import error:', error);
        return { error: error.message };
    }
}
