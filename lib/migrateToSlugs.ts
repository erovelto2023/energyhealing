/**
 * Migration script to generate slugs for existing products and glossary terms
 * Run this once to update all existing data with SEO-friendly slugs
 */

import connectToDatabase from './db';
import Product from './models/Product';
import GlossaryTerm from './models/GlossaryTerm';
import { slugify, makeUniqueSlug } from './utils/slugify';

async function migrateProductSlugs() {
    console.log('🔄 Migrating product slugs...');

    const products = await Product.find({}).lean();
    const existingSlugs: string[] = [];
    let updated = 0;

    for (const product of products) {
        // Skip if already has a slug
        if (product.slug) {
            existingSlugs.push(product.slug);
            continue;
        }

        // Generate slug from name
        const baseSlug = slugify(product.name);
        const uniqueSlug = makeUniqueSlug(baseSlug, existingSlugs);
        existingSlugs.push(uniqueSlug);

        // Update product
        await Product.findOneAndUpdate(
            { id: product.id },
            { $set: { slug: uniqueSlug } }
        );

        updated++;
        console.log(`  ✅ ${product.name} → ${uniqueSlug}`);
    }

    console.log(`✨ Updated ${updated} products with slugs`);
}

async function migrateGlossaryTermSlugs() {
    console.log('🔄 Migrating glossary term slugs...');

    const terms = await GlossaryTerm.find({}).lean();
    const existingSlugs: string[] = [];
    let updated = 0;

    for (const term of terms) {
        // Skip if already has a slug
        if (term.slug) {
            existingSlugs.push(term.slug);
            continue;
        }

        // Generate slug from term
        const baseSlug = slugify(term.term);
        const uniqueSlug = makeUniqueSlug(baseSlug, existingSlugs);
        existingSlugs.push(uniqueSlug);

        // Update term
        await GlossaryTerm.findOneAndUpdate(
            { id: term.id },
            { $set: { slug: uniqueSlug } }
        );

        updated++;
        console.log(`  ✅ ${term.term} → ${uniqueSlug}`);
    }

    console.log(`✨ Updated ${updated} glossary terms with slugs`);
}

export async function runSlugMigration() {
    try {
        console.log('🚀 Starting slug migration...\n');

        await connectToDatabase();

        await migrateProductSlugs();
        console.log('');
        await migrateGlossaryTermSlugs();

        console.log('\n✅ Migration completed successfully!');
        return { success: true };
    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        return { error: error.message };
    }
}

// Allow running directly
if (require.main === module) {
    runSlugMigration()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
