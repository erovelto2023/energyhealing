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
