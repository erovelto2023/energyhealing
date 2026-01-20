"use server";

import connectToDatabase from "./db";
import Product from "./models/Product";
import GlossaryTerm from "./models/GlossaryTerm";
import Herb from "./models/Herb";
import { INITIAL_PRODUCTS, INITIAL_GLOSSARY } from "./constants";
import { BULK_HERB_NAMES } from "./bulkSeedHerbs";
import { DETAILED_HERB_DATA } from "./detailedHerbData";

const SPICE_PROFILES: any = {
    "Adobo Seasoning": {
        category: "Blend",
        healing: ["Digestive Aid", "Antioxidant Support", "Circulation"],
        description: "A foundational Latin American blend of garlic, oregano, and black pepper that serves as a synergistic mix of functional spices.",
        physical: "The high concentration of garlic acts as a natural antibiotic and vasodilator, helping to lower elevated blood pressure—a common contributor to tension headaches and muscle stiffness. Oregano and cumin modulate immune responses, reducing systemic inflammation that underlies joint pain and arthritis.",
        emotional: "Associated with 'Grounding.' The earthy, savory notes carry deep, familiar warmth that anchors a scattered or anxious mind. The ritual of cooking with this blend becomes a mindful act of self-care, reminding the user that healing can happen at the dinner table.",
        benefits: "Garlic's allicin reduces CRP (C-reactive protein), a key marker of inflammation. Oregano provides carvacrol, modulating oxidative stress, while cumin improves gut motility—crucial since inflammation often begins in the gut.",
        usage: "Stir into soups/lentils for digestive support; toss with roasted cauliflower or sweet potatoes; add to beans to reduce bloating."
    },
    "Aji Amarillo Chile Powder": {
        category: "Chiles",
        healing: ["Metabolism Boost", "Pain Relief", "Endorphin Release"],
        description: "The 'sunshine' chile of Peru, known for its fruity heat and bright golden hue.",
        physical: "Capsaicin acts as a topical and internal analgesic by depleting Substance P, a neurotransmitter that sends pain signals to the brain. It is excellent for metabolic health and improving vascular flow.",
        emotional: "Used for 'Vitality.' The bright heat helps break through emotional stagnation or lethargy, acting as a 'spark' for those feeling uninspired or emotionally numb.",
        benefits: "Aids in thermogenesis (fat burning) and triggers a natural 'high' via endorphin release, which can offset the emotional weight of chronic pain.",
        usage: "Incorporate into creamy sauces, citrus-based marinades, or traditional Peruvian dishes."
    },
    "Basil, Dried": {
        category: "Herbs",
        healing: ["Stress Reduction", "Antibacterial", "Anti-inflammatory"],
        description: "A cornerstone of Mediterranean healing, known as 'Royal Herb' for its versatile protective qualities.",
        physical: "Contains high levels of orientin and viceninare, flavonoids that protect cell structures and chromosomes from radiation and oxygen-based damage. Reduces swelling in joints.",
        emotional: "Provides 'Centering.' Its sweet, green aroma is used in aromatherapy to reduce the feeling of 'overwhelm' and mental fatigue during high-stress periods.",
        benefits: "Rich in Eugenol, which blocks the activity of an enzyme called cyclooxygenase (COX), similar to how aspirin or ibuprofen works.",
        usage: "Infuse into tomato sauces, sprinkle over fresh vegetables, or use in poultry seasoning."
    },
    "Black Garlic Cloves": {
        category: "Superfood",
        healing: ["Heart Health", "High Antioxidant", "Cellular Protection"],
        description: "Regular garlic aged through fermentation, concentrating its bio-availability and softening its bite into a balsamic-like sweet flavor.",
        physical: "Strong cardiovascular support. SAC (S-allylcysteine) helps prevent arterial hardening and supports blood flow to extremities, vital for those with Raynaud's or poor circulation.",
        emotional: "Fosters 'Resilience.' The slow fermentation process represents patience and transformation; it is used energetically to help one process deep-seated grief and 'heavy' life transitions.",
        benefits: "Contains twice the antioxidants of raw garlic. Directly inhibits cholesterol synthesis and protects neurons from oxidative stress.",
        usage: "Blend into vinaigrettes, spread on artisan toast, or eat 1-2 cloves daily as a tonic."
    },
    "Cinnamon, Ceylon": {
        category: "Spices",
        healing: ["Blood Sugar Stability", "Anti-viral", "Warmth"],
        description: "Known as 'True Cinnamon,' harvested from the inner bark of the Cinnamomum verum tree.",
        physical: "Excellent for 'Cold Pain'—stiff joints that worsen in winter or poor circulation. It improves insulin sensitivity, making it a powerful ally for metabolic health.",
        emotional: "Provides 'Comfort & Connection.' Useful for those feeling emotionally 'frozen' or socially isolated, helping to open the heart center to warmth and empathy.",
        benefits: "Unlike Cassia, Ceylon is low in coumarin, protecting the liver while delivering cinnamaldehyde for blood-thinning and anti-microbial action.",
        usage: "Add to morning oats, whisk into coffee, or use in savory Moroccan stews."
    },
    "Ginger Root, Sliced": {
        category: "Spices",
        healing: ["Anti-emetic", "Muscle Recovery", "Circulation"],
        description: "A pungent, warming rhizome used for thousands of years in Ayurvedic and Traditional Chinese Medicine.",
        physical: "A potent remedy for post-workout soreness and osteoarthritis. Gingerols inhibit the formation of inflammatory cytokines, rivaling NSAIDs for pain management.",
        emotional: "Used for 'Courage.' In traditional medicine, ginger is seen as a way to stoke the 'internal fire,' helping individuals overcome fear-based procrastination.",
        benefits: "Enhances gastric motility and reduces serum cholesterol. Its warming effect helps move stagnant energy throughout the body.",
        usage: "Steep into tea with honey and lemon; add to stir-fries; or use in pickling."
    },
    "Lavender, Dried (Culinary)": {
        category: "Herbs",
        healing: ["Nervous System Sedative", "Migraine Relief", "Sleep Support"],
        description: "A delicate floral herb prized for its ability to bridge the gap between aromatic pleasure and clinical sedation.",
        physical: "Relieves tension headaches and migraines by relaxing the central nervous system. It acts as an antispasmodic for the digestive tract and muscles.",
        emotional: "The ultimate 'Anxiety Relief.' It soothes the frantic spirit and is used to treat 'Emotional Exhaustion' and burn-out, bringing a sense of peace to a chaotic environment.",
        benefits: "Linalool and linalyl acetate are absorbed into the bloodstream, where they modulate GABA receptors to lower cortisol and induce relaxation.",
        usage: "Steep in hot water for a bedtime tea; infuse into honey; or bake into light shortbread."
    },
    "Reishi Mushrooms, Dried": {
        category: "Mushrooms",
        healing: ["Immune Modulation", "Adrenal Support", "Longevity"],
        description: "Known as the 'Mushroom of Immortality,' it is the premier adaptogen in the fungal kingdom.",
        physical: "Helps the body manage the physical toll of stress. It modulates the immune system—calming it during autoimmune flares and boosting it during illness.",
        emotional: "Known as the 'Zen Mushroom.' It calms the 'Shen' (Spirit), reducing irritability, restless sleep, and the 'internal heat' associated with anger and frustration.",
        benefits: "Rich in triterpenes and beta-glucans which support liver detoxification and lower blood pressure over long-term use.",
        usage: "Rehydrate in broths, steep as a bitter tea, or grind into a fine powder for smoothies."
    },
    "Saffron, Spanish (Superior)": {
        category: "Spices",
        healing: ["Serotonin Boost", "Neuro-protection", "PMS Relief"],
        description: "The world's most expensive spice, sourced from the hand-picked stigmas of the Crocus sativus.",
        physical: "Clinically proven to reduce the physical severity of PMS and menstrual cramps. Supports retinal health and protects the brain from cellular aging.",
        emotional: "A powerful 'Natural Antidepressant.' Nicknamed the 'sunshine spice' for its ability to improve mood and emotional regulation during dark winters or depressive cycles.",
        benefits: "Active compounds crocin and safranal inhibit the reuptake of dopamine and norepinephrine, similar to pharmaceutical SSRIs but with fewer side effects.",
        usage: "Infuse in warm milk or tea; use in paella and risotto; or steep a few threads in water for a daily mood tonic."
    },
    "Turmeric Powder": {
        category: "Spices",
        healing: ["Systemic Anti-inflammatory", "Joint Repair", "Cognitive Health"],
        description: "The 'Golden Spice' of life, containing the potent polyphenol curcumin.",
        physical: "Targets chronic joint pain by blocking NF-kB, the 'master switch' for inflammation. It protects the liver from toxins and aids in the recovery of damaged tissue.",
        emotional: "Promotes 'Inner Light.' Used to combat the 'heaviness' and 'fog' of seasonal affective disorder, encouraging a brighter mental outlook.",
        benefits: "Curcumin rivals certain anti-inflammatory drugs. When paired with black pepper (piperine), absorption increases by up to 2,000%.",
        usage: "Golden milk (Turmeric latte), curries, or added to salad dressings with black pepper and olive oil."
    }
};

export async function ensureDatabaseSeeded() {
    await connectToDatabase();
    // Auto-seeding is disabled to allow full admin control over content.
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
