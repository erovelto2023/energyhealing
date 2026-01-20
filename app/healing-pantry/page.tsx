
import HealingPantryClient from "@/components/HealingPantryClient";
import { getHerbs } from "@/lib/actions";
import { getProducts } from "@/lib/initialData";

export const metadata = {
    title: "Healing Pantry | Kathleen Heals",
    description: "Explore the encyclopedia of therapeutic spices and remedies.",
};

export default async function HealingPantryPage({ searchParams }: { searchParams: { herb?: string } }) {
    const herbs = await getHerbs();
    const { products } = await getProducts();

    return <HealingPantryClient herbs={herbs} products={products} initialSlug={searchParams.herb} />;
}
