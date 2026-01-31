
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Schemas minimal for this operation
const OfferSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: String,
    isPublished: Boolean,
    description: String,
}, { timestamps: true });

// Check/Register Model standard info
const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);

const FAQSchema = new Schema({
    question: String,
    slug: String,
    relatedOfferId: String
}, { strict: false }); // strict:false to allow other fields

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/kathleen-heals');
        console.log("Connected to DB");

        // 1. Check/Create Offer
        const offerSlug = 'senior-yoga-program';
        let offer = await Offer.findOne({ slug: offerSlug });

        if (!offer) {
            console.log("Creating new sample offer...");
            offer = await Offer.create({
                title: "Senior Yoga & Pilates Program",
                slug: offerSlug,
                description: "A comprehensive guide designed specifically for seniors to regain mobility and strength safely.",
                content: "<h1>Senior Yoga & Pilates</h1><p>Join our exclusive program.</p>",
                isPublished: true
            });
            console.log("Created Offer:", offer._id);
        } else {
            console.log("Using existing Offer:", offer._id);
        }

        // 2. Find FAQ
        const faqSlug = 'which-is-better-for-seniors-pilates-or-yoga';
        const faq = await FAQ.findOne({ slug: faqSlug });

        if (!faq) {
            console.error("❌ FAQ not found with slug:", faqSlug);
            // Try to find ANY faq to link to if specific one missing?
            // Nah, user specifically asked for this one.
        } else {
            console.log("Found FAQ:", faq.question);

            // 3. Link them
            faq.relatedOfferId = offer._id.toString();
            await faq.save();
            console.log("✅ Successfully linked Offer to FAQ!");
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
