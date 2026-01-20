
import connectToDatabase from '@/lib/db';
import Herb from '@/lib/models/Herb';

// Helper to determine category from name
const determineCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('tea') || lower.includes('tisane') || lower.includes('blend')) return 'Tea';
    if (lower.includes('mushroom') || lower.includes('fungus')) return 'Mushrooms';
    if (lower.includes('chile') || lower.includes('chili') || lower.includes('pepper') || lower.includes('paprika')) return 'Chiles';
    if (lower.includes('salt') || lower.includes('sugar')) return 'Blends';
    if (lower.includes('extract') || lower.includes('flavoring')) return 'Extracts';
    if (lower.includes('seed') || lower.includes('nutmeg') || lower.includes('clove') || lower.includes('cinnamon') || lower.includes('cardamom') || lower.includes('cumin')) return 'Spices';
    if (lower.includes('basil') || lower.includes('oregano') || lower.includes('thyme') || lower.includes('rosemary') || lower.includes('sage') || lower.includes('mint')) return 'Herbs';
    return 'Spices';
};

// This list excludes non-herb items like "Bottle" from the raw input
export const BULK_HERB_NAMES = [
    "Adobo Seasoning", "Aji Amarillo Chile Powder", "Aji Amarillo Chiles, Dried", "Aji Panca Chile Powder", "Aji Panca Chiles, Dried", "Aji Paprika Chiles, Whole", "Aleppo Pepper, Mediterranean (Crushed)", "Allspice Berries, Whole", "Allspice, Ground", "Almond Extract, Natural", "Amaretto Flavoring, Natural", "Ancho Chile Peppers, Whole", "Ancho Chile Powder", "Anise Extract, Pure", "Anise Seed", "Annatto Powder", "Annatto Seeds", "Arrowroot Powder", "Assam Tea (Kondoli)",
    "Baharat Spice Blend", "Bamboo Mushrooms, Dried", "Basil, Dried", "Basil, Ground", "Bay Leaves, Ground", "Bay Leaves, Whole", "Berbere Spice", "Bird's Eye Chili", "Bird's Eye Chili Powder", "Bistro Mushroom Blend", "Black Currant Tea", "Black Fungus (Cloud Ear), Dried", "Black Garlic Cloves", "Black Garlic Powder", "Black Pepper", "Black Salt (Kala Namak)", "Black Tea, Orange Pekoe", "Black Truffle Salt", "Black Trumpet Mushrooms, Dried", "Black Walnut Flavoring, Natural", "Blackberry Fruit Tea Blend", "Blazei Brazilian Cap Mushrooms, Dried", "Bolete Mushroom Powder", "Bolete Mushrooms, Dried", "Bourbon Vanilla Rooibos Tea", "Brandy Flavoring, Natural", "Brown Sugar, Dark", "Brown Sugar, Granulated",
    "Cajun Blackening Seasoning", "Cajun Seasoning", "Calabrian Chile Peppers", "Canadian Steak Seasoning", "Candy Cap Mushrooms, Dried", "Cane Sugar Cubes", "Cane Syrup, Dried", "Cape Cod Seasoning", "Caraway Seeds", "Caraway, Ground", "Cardamom Pods, Black", "Cardamom Pods, Green", "Cardamom Seeds", "Cardamom, Ground", "Carom Seeds, Ground", "Cascabel Chile Peppers, Dried", "Cassia Bark (Cinnamon)", "Cauliflower Mushrooms, Dried", "Cayenne Pepper, Ground", "Celery Salt", "Celery Seed", "Ceylon Tea", "Chai Tea", "Chamomint Tea", "Champignon White Button Mushrooms, Dried", "Chanterelle Mushrooms, Dried", "Cherry Extract, Natural", "Chervil, Dried", "Chile De Arbol Powder", "Chile De Arbol, Dried", "Chile Verde Salt", "Chili Powder", "Chiltepin Pepper", "Chimichurri Blend", "Chipotle Chile Peppers", "Chipotle Chili Powder", "Chipotle Creole Spice Rub", "Chive Flakes", "Chive Powder", "Christmas Peppercorn Blend", "Cilantro Flakes, Dried", "Cinnamon Apricot Tisane", "Cinnamon Flavoring, Natural", "Cinnamon Sticks", "Cinnamon, Ceylon", "Cinnamon, Korintje", "Cinnamon, Vietnamese", "Citrus & Ginger Spice Blend", "Citrus Chamomile Tea", "Citrus Green Tea", "Cloves, Ground", "Cloves, Whole", "Cocoa Nibs", "Coconut Chips", "Coconut Flavoring, Natural", "Coconut Milk Powder", "Coconut Sugar", "Coffee Chile Spice Rub", "Coffee Flavoring, Natural", "Coriander Powder", "Coriander Seed", "Corn Husks", "Cream of Tartar", "Cubeb Pepper", "Cumin Powder", "Cumin Seeds", "Curing Salt, Pink",
    "Daikon Radish Seeds", "Darjeeling Tea", "Dark Cocoa Powder", "Dill Pollen", "Dill Seed", "Dill Weed, Dried", "Dry Mexican Mole Spice Blend",
    "Earl Grey Tea", "Ecuadorian Vanilla Beans", "English Breakfast Black Tea", "Enoki Mushrooms, Dried", "Espresso Brava Salt", "European Mushroom Blend",
    "Fajita Marinade Seasoning", "Far East Rub", "Fennel Pollen", "Fennel Seeds", "Fennel, Ground", "Fenugreek Leaves, Dried", "Fenugreek Powder", "Fenugreek Seeds", "Five Peppercorn Mélange", "Five Spice Powder, Chinese", "Fleur de Sel", "Forest Mushroom Blend", "Four Peppercorn Blend", "French Mustard and Herb Blend",
    "Galangal, Whole", "Garam Masala", "Garlic Pepper Steak Seasoning", "Garlic Powder", "Garlic Salt", "Garlic, Granulated", "Garlic, Minced", "Ghost Chili Pepper Powder", "Ghost Pepper, Dried", "Ginger Flavoring, Natural", "Ginger Peach Tea", "Ginger Powder", "Ginger Root, Sliced", "Ginger, Crystallized", "Grains of Paradise", "Grapefruit Powder", "Green Mango Powder (Amchoor)", "Green Peppercorns", "Green Serrano Chile Powder", "Green Tea", "Ground Vanilla Beans", "Guajillo Chile Powder", "Guajillo Chiles", "Gumbo File Powder", "Gunpowder Green Tea",
    "Habanero Pepper", "Habanero Powder", "Habanero Salt", "Harissa Spice Blend", "Hazelnut Flavoring, Natural", "Herbal Chai Tea", "Herbal Chocolate Chai", "Herbes de Provence", "Hibiscus Flowers, Dried", "Hibiscus Powder", "Hickory Steak Seasoning", "Himalayan Pink Salt", "Honey Powder", "Horseradish Powder", "Hot Chili Powder",
    "Immortalitea", "Indian Vanilla Beans", "Irish Breakfast Blend", "Italian Herb Seasoning",
    "Jalapeno Chili Powder", "Jamaican Jerk Seasoning", "Japanese Yellow Curry Powder", "Japones Chile Peppers, Dried", "Jasmine Pearls", "Jasmine Tea", "Jerk Seasoning", "Juniper Berries",
    "Kabsa Spice Mix", "King Trumpet Mushrooms", "Korean Black Garlic Seasoning", "Korean Red Chili Pepper Flakes", "Kukicha Twig Tea",
    "Lavender Flavoring, Natural", "Lavender, Dried", "Lemon Extract, Pure", "Lemon Juice Powder", "Lemon Mint Tea", "Lemon Peel", "Lemon Pepper Seasoning", "Lemongrass Powder", "Lime Flavoring, Natural", "Lime Fresco Salt", "Lime Juice Powder", "Lime Peel", "Lion's Mane Mushrooms, Dried", "Lobster Mushrooms, Dried", "Long Pepper",
    "Mace, Ground", "Madagascar Vanilla Bean Paste", "Madagascar Vanilla Extract", "Maitake Mushrooms", "Makrut Lime Leaves", "Mango Tea", "Maple Flavoring, Natural", "Maple Sugar", "Marjoram, Dried", "Matsutake Mushrooms, Dried", "Mediterranean Spice Blend", "Mexican Vanilla Extract", "Mild Chile Threads", "Molasses Powder", "Morel Mushrooms, Dried", "Moroccan Mint Green Tea", "Mousseron Mushrooms, Dried", "Mulato Chile Peppers, Dried", "Mulling Spices", "Mushroom Jungle Blend", "Mustard Powder", "Mustard Seeds",
    "Nacional Cacao Powder", "Nacional Cacao Butter", "Nacional Cacao Nibs", "Nameko Mushrooms, Dried", "Natural Chocolate Extract", "Natural Vanilla Flavor", "New Mexico Chiles, Dried", "New Mexico Chili Powder", "Nigella Seeds", "Nora Chile Peppers, Dried", "Northwoods Mushroom Blend", "Nutmeg, Ground", "Nutmeg, Whole",
    "Onion Powder", "Onion Salt", "Onion, Granulated", "Onion, Minced", "Oolong Tea", "Orange Extract, Pure", "Orange Peel, Dried", "Oregano, Ground", "Oregano, Mediterranean", "Oregano, Mexican", "Organic Vanilla Beans", "Oyster Mushrooms, Dried",
    "Paddy Straw Mushrooms, Dried", "Paella Seasoning", "Panch Phoron", "Paprika, Hungarian", "Paprika, Smoked", "Paprika, Spanish", "Parsley Flakes", "Pasilla Chili Powder", "Pasilla Pepper", "Passionberry Fruit Tisane", "Peppercorns, Tuxedo Blend", "Peppermint Extract, Natural", "Peppermint, Crushed", "Pequin Chiles, Dried", "Pickling Spice", "Pineapple Papaya Green Sencha Tea", "Pink Peppercorns", "Pistachio Flavoring, Natural", "Pizza Seasoning", "Poppy Seeds", "Porcini Mushroom Rub", "Porcini Mushrooms, Dried", "Porcini Powder", "Portabella Mushroom Powder", "Portabella Mushrooms, Dried", "Poultry Seasoning Spice Rub", "Pumpkin Pie Spice", "Puya Chile Peppers, Dried",
    "Quatre épices",
    "Ras El Hanout", "Raspberry Extract, Natural", "Raspberry Powder", "Red Chili Flakes", "Red Pepper, Crushed", "Reishi Mushrooms, Dried", "Rooibos Tea", "Rosemary, Dried", "Rosemary, Ground", "Rum Flavoring, Natural",
    "Saffron Milk Cap Mushrooms, Dried", "Saffron", "Sage, Dalmatian", "Sage, Ground", "Sage, Rubbed", "Salsa Verde Seasoning", "Samoan Vanilla Beans", "Sassafras Powder", "Savory, Summer", "Scorpion Pepper", "Scotch Bonnet Pepper", "Sea Salt (Smoked)", "Sea Salt, Black Hawaiian", "Sea Salt, Gray", "Sea Salt, Greek", "Sea Salt, Himalayan", "Seafood Spice Blend", "Seasoning Salt", "Serrano Chile Peppers, Dried", "Sesame Seeds", "Shallots", "Shichimi Togarashi", "Shiitake Mushroom Caps", "Shiitake Mushroom Powder", "Shiitake Mushrooms, Dried", "Sichuan Peppercorns", "Smoke Flavor", "Smoked Peppercorn Sage Rub", "Soy Sauce Powder", "Spanish Rice Blend", "Spearmint Flavoring, Natural", "Spearmint, Crushed", "Spicy Curry Sea Salt", "Sriracha Powder", "Star Anise", "Steak Mushroom Blend", "Stir-Fry Mushroom Blend", "Strawberry Extract, Natural", "Strawberry Powder", "Sumac Spice", "Szechuan Pepper Salt",
    "Taco Seasoning", "Tahitian Vanilla Beans", "Tahitian Vanilla Extract", "Tamarind Powder", "Tandoori Spice", "Tarragon (French)", "Tellicherry Peppercorns", "Thai Chili Pepper", "Thai Coconut Green Curry Powder", "Thai Ginger Salt", "Thyme, Dried", "Thyme, Ground", "Tomato Powder", "Triple Berry Tea", "Turbinado Sugar", "Turkey Tail Mushrooms, Dried", "Turmeric Powder",
    "Urfa Biber Pepper Flakes",
    "Vadouvan Spice", "Vanilla Bean Paste", "Vanilla Bean Sugar", "Vanilla Beans", "Vanilla Extract", "Vanilla Powder", "Vindaloo Curry Powder", "Vinegar Powder",
    "Wasabi, Powder", "White Pepper, Ground", "White Peppercorns", "White Pomegranate Tea", "White Tea", "Wild Berry Tea", "Wiri Wiri Chili Powder", "Wiri Wiri Peppers", "Wood Ear Mushrooms, Dried", "Worcestershire Sauce Powder",
    "Zaatar Spice"
];

export async function bulkSeedHerbs() {
    try {
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');

        // 1. Get existing herbs to avoid duplicates
        const existing = await Herb.find({}).lean();
        const existingNames = new Set(existing.map((h: any) => h.name));
        const existingSlugs = existing.map((h: any) => h.slug);

        let count = 0;

        for (const name of BULK_HERB_NAMES) {
            if (existingNames.has(name)) continue;

            // Skip if a very similar name exists (simple heuristic: exact match or "Dried" variant logic already handled by manual curated list above)

            const category = determineCategory(name);
            const baseSlug = slugify(name);
            const slug = makeUniqueSlug(baseSlug, existingSlugs);
            existingSlugs.push(slug);

            await Herb.create({
                id: `herb-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                name: name,
                slug,
                category,
                healing: [], // To be populated later
                description: `A generic entry for ${name}. Details to be added.`,
                physical: "",
                emotional: "",
                benefits: "",
                usage: ""
            });
            count++;
        }

        console.log(`Successfully bulk seeded ${count} new herbs.`);
        return { success: true, count };

    } catch (error) {
        console.error("Bulk seeding failed", error);
        return { success: false, error };
    }
}
