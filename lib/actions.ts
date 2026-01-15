"use server";

import connectToDatabase from "./db";
import PendingReview from "./models/PendingReview";
import Product from "./models/Product";
import GlossaryTerm from "./models/GlossaryTerm";
import StrategyQuestion from "./models/StrategyQuestion";
import SearchLog from "./models/SearchLog";
import LearningPath from "./models/LearningPath";
import Niche from "./models/Niche";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Subscriber from "./models/Subscriber";
import SalesPage from "./models/SalesPage";

export async function subscribeUser(formData: FormData) {
    const email = formData.get('email') as string;
    if (!email) return { error: "Email is required" };

    try {
        await connectToDatabase();
        // Check if exists
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return { message: "You are already subscribed!" };
        }

        await Subscriber.create({
            id: `sub-${Date.now()}`,
            email,
            subscribedAt: new Date(),
            status: 'active'
        });

        return { success: true, message: "Successfully subscribed!" };
    } catch (e: any) {
        console.error("Subscription error", e);
        return { error: "Failed to subscribe. Please try again." };
    }
}

export async function getSubscribers() {
    try {
        await connectToDatabase();
        const subs = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(subs));
    } catch (e) {
        return [];
    }
}

export async function submitReview(formData: FormData) {
    const productId = Number(formData.get('productId'));
    const productName = String(formData.get('productName') || '');
    const user = String(formData.get('user') || '');
    const rating = Number(formData.get('rating'));
    const comment = String(formData.get('comment') || '');

    if (!productId || !productName || !user || !rating || !comment) {
        return { error: "Missing fields" };
    }

    await connectToDatabase();

    await PendingReview.create({
        productId,
        productName,
        user,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
    });

    return { success: true };
}

export async function approveReview(reviewId: string) {
    await connectToDatabase();
    const review = await PendingReview.findById(reviewId);
    if (!review) return { error: "Review not found" };

    // Add to product
    await Product.findOneAndUpdate(
        { id: review.productId },
        {
            $push: {
                userReviews: {
                    user: review.user,
                    rating: review.rating,
                    comment: review.comment,
                    date: review.date,
                    isApproved: true
                }
            },
            $inc: { reviewsCount: 1 } // Naive increment, simple for now. Avg rating update would be better.
        }
    );

    // Remove from pending
    await PendingReview.findByIdAndDelete(reviewId);

    revalidatePath('/admin');
    return { success: true };
}

export async function rejectReview(reviewId: string) {
    await connectToDatabase();
    await PendingReview.findByIdAndDelete(reviewId);
    revalidatePath('/admin');
    return { success: true };
}

export async function createProduct(data: any) {
    try {
        await connectToDatabase();
        // Simple ID generation for now
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        // Generate slug from name if not provided
        let slug = data.slug;
        if (!slug && data.name) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.name);
            // Get existing slugs to ensure uniqueness
            const existingProducts = await Product.find({} as any, { slug: 1 }).lean();
            const existingSlugs = existingProducts.map((p: any) => p.slug).filter(Boolean);
            slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        const newProduct = await Product.create({
            ...data,
            id: nextId,
            slug,
            rating: 0,
            reviewsCount: 0,
            userReviews: []
        });

        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
    } catch (error: any) {
        console.error("Error creating product:", error);
        return { error: error.message || "Failed to create product" };
    }
}



export async function createGlossaryTerm(data: any) {
    try {
        await connectToDatabase();
        // Simple ID generation
        const count = await GlossaryTerm.countDocuments();
        const nextId = `g${count + 1}-${Date.now()}`; // Unique string ID

        // Generate slug from term if not provided
        let slug = data.slug;
        if (!slug && data.term) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.term);
            // Get existing slugs to ensure uniqueness
            const existingTerms = await GlossaryTerm.find({} as any, { slug: 1 }).lean();
            const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
            slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        const newTerm = await GlossaryTerm.create({
            ...data,
            id: nextId,
            slug
        });

        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true, term: JSON.parse(JSON.stringify(newTerm)) };
    } catch (error: any) {
        console.error("Error creating glossary term:", error);
        return { error: error.message || "Failed to create glossary term" };
    }
}

export async function createStrategyQuestion(data: any) {
    try {
        await connectToDatabase();
        const count = await StrategyQuestion.countDocuments();
        const nextId = `q${count + 1}-${Date.now()}`;

        // Ensure data.options parses filters correctly if passed as string
        const formattedOptions = data.options.map((opt: any) => ({
            ...opt,
            filters: typeof opt.filters === 'string' ? JSON.parse(opt.filters) : opt.filters
        }));

        const newQuestion = await StrategyQuestion.create({
            ...data,
            id: nextId,
            options: formattedOptions
        });

        revalidatePath('/admin');
        return { success: true, question: JSON.parse(JSON.stringify(newQuestion)) };
    } catch (error: any) {
        console.error("Error creating strategy question:", error);
        return { error: error.message || "Failed to create question" };
    }
}

export async function getStrategyQuestions() {
    try {
        await connectToDatabase();
        const questions = await StrategyQuestion.find({}).sort({ step: 1 }).lean();
        return JSON.parse(JSON.stringify(questions));
    } catch (error) {
        console.error("Error fetching strategy questions:", error);
        return [];
    }
}

export async function trackProductClick(productId: number) {
    try {
        await connectToDatabase();
        console.log(`🖱️ Tracking click for product ID: ${productId}`);
        await Product.findOneAndUpdate({ id: productId } as any, { $inc: { clicks: 1 } });
    } catch (e) {
        console.error("Tracking click failed", e);
    }
    // No return needed, fire and forget
}

export async function logSearchQuery(query: string, resultsCount: number) {
    if (!query || query.trim().length === 0) return;
    try {
        await connectToDatabase();
        // Upsert the log
        await SearchLog.findOneAndUpdate(
            { query: query.toLowerCase().trim() },
            {
                $inc: { count: 1 },
                $set: { lastSearched: new Date(), resultsCount }
            },
            { upsert: true }
        );
    } catch (e) {
        console.error("Logging search failed", e);
    }
}

export async function getLearningPaths() {
    try {
        await connectToDatabase();
        const paths = await LearningPath.find({}).lean();
        return JSON.parse(JSON.stringify(paths));
    } catch (e) {
        console.error("Failed to fetch learning paths", e);
        return [];
    }
}

export async function updateProduct(data: any) {
    try {
        await connectToDatabase();

        // Regenerate slug if name changed and no custom slug provided
        if (data.name && !data.slug) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.name);
            // Get existing slugs excluding current product
            const existingProducts = await Product.find({ id: { $ne: data.id } } as any, { slug: 1 }).lean();
            const existingSlugs = existingProducts.map((p: any) => p.slug).filter(Boolean);
            data.slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        await Product.findOneAndUpdate({ id: data.id } as any, data);
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating product:", error);
        return { error: error.message || "Failed to update product" };
    }
}

export async function deleteProduct(productId: number) {
    try {
        console.log('🗑️ Attempting to delete product with ID:', productId);
        await connectToDatabase();

        const result = await Product.findOneAndDelete({ id: productId });
        console.log('Delete result:', result ? 'Found and deleted' : 'Not found');

        if (!result) {
            console.error('❌ Product not found with ID:', productId);
            return { error: "Product not found" };
        }

        revalidatePath('/admin');
        revalidatePath('/');
        console.log('✅ Product deleted successfully:', productId);
        return { success: true };
    } catch (error: any) {
        console.error('❌ Error deleting product:', error);
        return { error: error.message || "Failed to delete product" };
    }
}

export async function updateGlossaryTerm(data: any) {
    try {
        await connectToDatabase();

        // Regenerate slug if term changed and no custom slug provided
        if (data.term && !data.slug) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.term);
            // Get existing slugs excluding current term
            const existingTerms = await GlossaryTerm.find({ id: { $ne: data.id } }, { slug: 1 }).lean();
            const existingSlugs = existingTerms.map(t => t.slug).filter(Boolean);
            data.slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        await GlossaryTerm.findOneAndUpdate({ id: data.id }, data);
        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating glossary term:", error);
        return { error: error.message || "Failed to update term" };
    }
}

export async function deleteGlossaryTerm(termId: string) {
    try {
        console.log('🗑️ Attempting to delete glossary term with ID:', termId);
        await connectToDatabase();

        const result = await GlossaryTerm.findOneAndDelete({ id: termId });
        console.log('Delete result:', result ? 'Found and deleted' : 'Not found');

        if (!result) {
            console.error('❌ Glossary term not found with ID:', termId);
            return { error: "Term not found" };
        }

        revalidatePath('/admin');
        revalidatePath('/glossary');
        console.log('✅ Glossary term deleted successfully:', termId);
        return { success: true };
    } catch (error: any) {
        console.error('❌ Error deleting glossary term:', error);
        return { error: error.message || "Failed to delete term" };
    }
}

export async function createNiche(data: any) {
    try {
        await connectToDatabase();
        const count = await Niche.countDocuments();
        const nextId = `n-${Date.now()}`;

        const newNiche = await Niche.create({
            ...data,
            id: nextId
        });
        revalidatePath('/admin');
        revalidatePath('/niches');
        return { success: true, niche: JSON.parse(JSON.stringify(newNiche)) };
    } catch (error: any) {
        console.error("Error creating niche:", error);
        return { error: error.message };
    }
}

export async function updateNiche(data: any) {
    try {
        await connectToDatabase();
        await Niche.findOneAndUpdate({ id: data.id } as any, data);
        revalidatePath('/admin');
        revalidatePath('/niches');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating niche:", error);
        return { error: error.message };
    }
}

export async function deleteNiche(nicheId: string) {
    try {
        await connectToDatabase();
        await Niche.findOneAndDelete({ id: nicheId });
        revalidatePath('/admin');
        revalidatePath('/niches');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getNiches() {
    try {
        await connectToDatabase();
        const niches = await Niche.find({}).lean();
        return JSON.parse(JSON.stringify(niches));
    } catch (e) {
        console.error("Failed to fetch niches", e);
        return [];
    }
}

export async function getNicheBySlug(slug: string) {
    try {
        await connectToDatabase();
        // Fallback to searching by ID if slug not found or maybe handle both
        // Assuming slug usage primarily.
        const niche = await Niche.findOne({ $or: [{ slug: slug }, { id: slug }] } as any).lean();
        if (!niche) return null;
        return JSON.parse(JSON.stringify(niche));
    } catch (e) {
        console.error("Failed to fetch niche by slug", e);
        return null;
    }
}

export async function bulkCreateGlossaryTerms(termsData: any[]) {
    try {
        await connectToDatabase();
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');

        const existingTerms = await GlossaryTerm.find({} as any, { slug: 1 }).lean();
        const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
        let currentCount = await GlossaryTerm.countDocuments();

        const results = [];
        for (const data of termsData) {
            currentCount++;
            const nextId = `g${currentCount}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            let slug = data.slug;
            if (!slug && data.term) {
                const baseSlug = slugify(data.term);
                slug = makeUniqueSlug(baseSlug, existingSlugs);
                existingSlugs.push(slug);
            }

            // Handle recommended tools if passed as tool IDs
            let recommendedTools = data.recommendedTools || [];
            if (data.recommendedToolIds && Array.isArray(data.recommendedToolIds)) {
                recommendedTools = data.recommendedToolIds.map((id: any) => ({
                    productId: Number(id),
                    context: "Recommended Tool"
                }));
            }

            const newTerm = await GlossaryTerm.create({
                ...data,
                id: nextId,
                slug,
                recommendedTools
            });
            results.push(newTerm);
        }

        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true, count: results.length };
    } catch (error: any) {
        console.error("Error bulk creating glossary terms:", error);
        return { error: error.message || "Failed to bulk create terms" };
    }
}


export async function deleteGlossaryTerms(termIds: string[]) {
    try {
        await connectToDatabase();
        await GlossaryTerm.deleteMany({ id: { $in: termIds } });
        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true };
    } catch (error: any) {
        console.error("Error bulk deleting glossary terms:", error);
        return { error: error.message || "Failed to delete terms" };
    }
}

export async function findDuplicateGlossaryTerms(niche?: string) {
    try {
        await connectToDatabase();
        const matchStage = niche ? { niche: niche } : {};
        const duplicates = await GlossaryTerm.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $toLower: "$term" },
                    count: { $sum: 1 },
                    terms: { $push: "$$ROOT" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);
        return JSON.parse(JSON.stringify(duplicates));
    } catch (error: any) {
        console.error("Error finding duplicate glossary terms:", error);
        return { error: error.message || "Failed to find duplicates" };
    }
}

export async function importHealingTerms(rawText: string) {
    try {
        await connectToDatabase();
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');

        const existingTerms = await GlossaryTerm.find({} as any, { slug: 1 }).lean();
        const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
        let currentCount = await GlossaryTerm.countDocuments();
        const results = [];

        // Check for JSON input
        let isJson = false;
        let jsonData: any[] = [];
        try {
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed)) {
                isJson = true;
                jsonData = parsed;
            }
        } catch (e) {
            // Not JSON, continue with legacy text parser
        }

        if (isJson) {
            // --- RICH JSON IMPORT ---
            for (const item of jsonData) {
                currentCount++;
                const nextId = `g${currentCount}-${Date.now()}`;

                const termName = item.term;
                if (!termName) continue;

                const baseSlug = slugify(termName);
                const slug = makeUniqueSlug(baseSlug, existingSlugs);
                existingSlugs.push(slug);

                // Handle recommended tools if passed as tool IDs
                let recommendedTools = item.recommendedTools || [];
                if (item.recommendedToolIds && Array.isArray(item.recommendedToolIds)) {
                    recommendedTools = item.recommendedToolIds.map((id: any) => ({
                        productId: Number(id),
                        context: "Recommended Tool"
                    }));
                }

                const newTerm = await GlossaryTerm.create({
                    ...item,
                    id: nextId,
                    slug, // Ensure generated slug overrides unless specifically validated
                    recommendedTools, // Explicitly include transformed tools
                    niche: item.niche || "Energy Healing",
                    category: item.category || "Energy Healing",
                    definition: item.definition || item.fullDefinition || `### Concept & Meaning\n${item.shortDefinition || ""}`,
                    shortDefinition: item.shortDefinition || (item.definition ? item.definition.substring(0, 150) : "")
                });
                results.push(newTerm);
            }

        } else {
            // --- LEGACY TEXT IMPORT ---
            const lines = rawText.split('\n')
                .map(l => l.trim())
                .filter(l => l && !l.startsWith('#') && !l.includes('HEALING TERMS'));

            for (const line of lines) {
                currentCount++;
                const nextId = `h${currentCount}-${Date.now()}`;

                // Smart delimiter detection
                let delimiter = "#";
                if (!line.includes("#") && line.includes("|")) delimiter = "|";

                const parts = line.split(delimiter).map(p => p.trim());
                let termName = parts[0];
                let meaning = parts[1] || "A core concept in energy medicine and holistic healing.";
                let application = parts[2] || `Example: "${termName} is often used to balance the body's energy field."`;
                let category = parts[3] || "Energy Healing";
                let toolIdsStr = parts[4] || "";

                const toolIds = toolIdsStr.split(',').map(id => Number(id.trim())).filter(n => !isNaN(n));
                const recommendedTools = toolIds.map(id => ({ productId: id, context: "Recommended for this practice" }));

                const baseSlug = slugify(termName);
                const slug = makeUniqueSlug(baseSlug, existingSlugs);
                existingSlugs.push(slug);

                const definition = `### Concept & Meaning\n${meaning}\n\n### Practical Application\n${application}`;

                const newTerm = await GlossaryTerm.create({
                    id: nextId,
                    term: termName,
                    slug,
                    shortDefinition: meaning.substring(0, 150) + (meaning.length > 150 ? '...' : ''),
                    definition: definition,
                    category: category,
                    niche: "Energy Healing",
                    synonyms: [],
                    recommendedTools: recommendedTools
                });
                results.push(newTerm);
            }
        }

        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true, count: results.length };
    } catch (error: any) {
        console.error("Error importing healing terms:", error);
        return { error: error.message || "Failed to import terms" };
    }
}

export async function seedHealingData() {
    const data = `
Chakra # Energy centers in the body that correspond to specific nerve bundles and internal organs. # Focusing on the Heart Chakra can improve emotional balance and compassion. # Anatomy
Reiki # A Japanese technique for stress reduction and relaxation that also promotes healing. # A typical Reiki session involves the practitioner placing hands lightly on or just above the client. # Modality
Aura # The electromagnetic field that surrounds the human body and every living thing. # Cleaning your aura is essential for maintaining high energy levels. # Energy Field
Meridian # Energy pathways in the body through which Qi flows, used in acupuncture. # Blockages in a meridian can lead to physical or emotional issues. # Anatomy
Prana # The Sanskrit word for "life force energy" or vital principle. # Breathing exercises (Pranayama) help increase the flow of Prana in the body. # Vitality
Grounding # The practice of balancing your physical and energy bodies by connecting with the earth. # Walking barefoot on grass is a simple grounding technique. # Technique
Crystals # Minerals with specific atomic structures believed to store and transmit energy. # Amethyst is popular for its calming and protective properties. # Tools
Smudging # Ancient ceremony for cleansing a person or place of negative energy with smoke. # Use white sage for smudging your home to clear stagnant energy. # Cleansing
Sound Potential # Using vibrational frequencies to restore balance and harmony. # Tibetan singing bowls are often used for deep relaxation and healing. # Modality
Intention # The conscious focusing of mental energy toward a specific outcome. # Setting a clear intention before a session amplifies its effectiveness. # Mindset
    `.trim();

    return await importHealingTerms(data);
}

// --- SALES PAGE ACTIONS ---

export async function getSalesPages() {
    try {
        await connectToDatabase();
        const pages = await SalesPage.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(pages));
    } catch (error: any) {
        console.error("Error fetching sales pages:", error);
        return [];
    }
}

export async function getSalesPageBySlug(slug: string) {
    try {
        await connectToDatabase();
        const page = await SalesPage.findOne({ slug }).lean();
        return page ? JSON.parse(JSON.stringify(page)) : null;
    } catch (error: any) {
        console.error("Error fetching sales page by slug:", error);
        return null;
    }
}

export async function createOrUpdateSalesPage(id: string | null, data: any) {
    try {
        await connectToDatabase();

        if (id) {
            const updated = await SalesPage.findByIdAndUpdate(id, data, { new: true });
            revalidatePath('/admin');
            revalidatePath(`/offers/${data.slug}`);
            revalidatePath('/marketplace');
            revalidatePath('/');
            return { success: true, page: JSON.parse(JSON.stringify(updated)) };
        } else {
            const created = await SalesPage.create(data);
            revalidatePath('/admin');
            revalidatePath('/marketplace');
            revalidatePath('/');
            return { success: true, page: JSON.parse(JSON.stringify(created)) };
        }
    } catch (error: any) {
        console.error("Error saving sales page:", error);
        return { error: error.message || "Failed to save sales page" };
    }
}

export async function deleteSalesPage(id: string) {
    try {
        await connectToDatabase();
        await SalesPage.findByIdAndDelete(id);
        revalidatePath('/admin');
        revalidatePath('/marketplace');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting sales page:", error);
        return { error: error.message || "Failed to delete sales page" };
    }
}
// --- ANALYTICS ACTIONS ---

export async function trackSalesPageVisit(slug: string, version: 'A' | 'B' | null) {
    try {
        await connectToDatabase();
        const update: any = { $inc: { views: 1 } };
        if (version === 'A') update.$inc.viewsA = 1;
        if (version === 'B') update.$inc.viewsB = 1;

        await SalesPage.findOneAndUpdate({ slug }, update);
        return { success: true };
    } catch (error) {
        console.error("Visit tracking failed:", error);
        return { success: false };
    }
}

export async function trackSalesPageBuyClick(slug: string, version: 'A' | 'B' | null) {
    try {
        await connectToDatabase();
        const update: any = { $inc: { clicks: 1 } };
        if (version === 'A') update.$inc.clicksA = 1;
        if (version === 'B') update.$inc.clicksB = 1;

        await SalesPage.findOneAndUpdate({ slug }, update);
        return { success: true };
    } catch (error) {
        console.error("Click tracking failed:", error);
        return { success: false };
    }
}
