"use server";

import connectToDatabase from "./db";
import Product from "./models/Product";
import GlossaryTerm from "./models/GlossaryTerm";
import { INITIAL_PRODUCTS, INITIAL_GLOSSARY } from "./constants";

export async function ensureDatabaseSeeded() {
    await connectToDatabase();

    // Auto-seeding disabled to allow admins to clear data
    // Uncomment below to enable automatic seeding on empty database

    // const productCount = await Product.countDocuments();
    // if (productCount === 0) {
    //     console.log("Seeding Products...");
    //     await Product.insertMany(INITIAL_PRODUCTS);
    // }

    // const glossaryCount = await GlossaryTerm.countDocuments();
    // if (glossaryCount === 0) {
    //     console.log("Seeding Glossary...");
    //     await GlossaryTerm.insertMany(INITIAL_GLOSSARY);
    // }
}

export async function getProducts(query?: any): Promise<{ products: any[], total: number, totalPages: number }> {
    await ensureDatabaseSeeded();

    // Basic filtering if query provided
    const filter: any = {};
    if (query?.niche && query.niche !== 'all') {
        filter.niche = query.niche;
    }
    if (query?.type && query.type !== 'all') {
        if (query.type === 'tool') {
            filter.$or = [{ type: 'tool' }, { type: { $exists: false } }];
        } else {
            filter.type = query.type;
        }
    }
    if (query?.priceModel && query.priceModel !== 'all') {
        filter.priceModel = query.priceModel;
    }
    if (query?.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(query.search, 'i')] } }
        ];
    }
    if (query?.ids && Array.isArray(query.ids)) {
        filter.id = { $in: query.ids };
    }

    const page = query?.page ? parseInt(query.page) : 1;
    const limit = query?.limit ? parseInt(query.limit) : 1000; // Default high if not paginated explicitly
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    let products;

    if (query?.random) {
        // Use MongoDB $sample for randomization
        products = await Product.aggregate([
            { $match: filter },
            { $sample: { size: limit } }
        ]);
    } else {
        products = await Product.find(filter).skip(skip).limit(limit).lean();
    }

    return {
        products: JSON.parse(JSON.stringify(products)),
        total,
        totalPages: Math.ceil(total / limit)
    };
}

export async function getGlossaryTerms(query?: any) {
    await ensureDatabaseSeeded();

    const { niche, search, letter, page = 1, limit = 50 } = query || {};
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (niche && niche !== 'all') {
        filter.niche = niche;
    }

    if (search) {
        filter.$or = [
            { term: { $regex: search, $options: 'i' } },
            { definition: { $regex: search, $options: 'i' } }
        ];
    } else if (letter && letter !== 'All') {
        filter.term = { $regex: `^${letter}`, $options: 'i' };
    }

    const total = await GlossaryTerm.countDocuments(filter);
    const terms = await GlossaryTerm.find(filter).sort({ term: 1 }).skip(skip).limit(limit).lean();

    return {
        terms: JSON.parse(JSON.stringify(terms)),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page)
    };
}

export async function getPendingReviews() {
    await connectToDatabase();
    // Dynamically import to avoid circular dep issues if any, though none currently
    const PendingReview = (await import("./models/PendingReview")).default;
    const reviews = await PendingReview.find().lean();
    return JSON.parse(JSON.stringify(reviews));
}

export async function getProduct(id: string | number) {
    await ensureDatabaseSeeded();
    // Try finding by slug first (SEO-friendly), then custom id (numeric), then _id (MongoDB)
    let product;
    if (!isNaN(Number(id)) && /^\d+$/.test(String(id))) {
        // Numeric ID
        product = await Product.findOne({ id: Number(id) } as any).lean();
    } else {
        // Try slug first, then MongoDB _id
        product = await Product.findOne({ slug: String(id) } as any).lean();
        if (!product) {
            product = await Product.findOne({ id: id } as any).lean();
        }
        if (!product) {
            try {
                product = await Product.findById(id).lean();
            } catch (e) {
                // Invalid MongoDB ID format
            }
        }
    }
    return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getGlossaryTerm(id: string) {
    await ensureDatabaseSeeded();
    // Try finding by slug first (SEO-friendly), then by id
    let term = await GlossaryTerm.findOne({ slug: id } as any).lean();
    if (!term) {
        term = await GlossaryTerm.findOne({ id: id } as any).lean();
    }
    return term ? JSON.parse(JSON.stringify(term)) : null;
}
