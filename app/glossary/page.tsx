import { getGlossaryTerms } from '@/lib/initialData';
import GlossaryList from '@/components/features/GlossaryList';

export default async function GlossaryPage({ searchParams }: { searchParams: Promise<{ q?: string; niche?: string; page?: string; letter?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const { q, niche, page, letter } = resolvedSearchParams;
    const { terms, totalPages, currentPage } = await getGlossaryTerms({ search: q, niche, page, letter });

    const isHealing = niche === "Energy Healing";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-[#FAFAF9] overflow-hidden">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-teal-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-violet-50/50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white border border-stone-200 text-teal-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                        {isHealing ? "Energy Intelligence" : "Knowledge Base"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-800 tracking-tight mb-6">
                        {isHealing ? "Healing Dictionary" : "Glossary of Terms"}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
                        {isHealing
                            ? "Explore the comprehensive lexicon of energy healing, spiritual concepts, and holistic wellness."
                            : "Master the terminology and core concepts of the platform."}
                    </p>
                </div>
            </div>

            <GlossaryList
                terms={terms}
                initialTotalPages={totalPages}
                initialPage={currentPage}
            />
        </div>
    );
}
