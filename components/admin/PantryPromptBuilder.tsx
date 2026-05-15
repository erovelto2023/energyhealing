import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PantryPromptBuilderProps {
    onBack: () => void;
}

const CATEGORIES = [
    "Grounding & Roots",
    "Heart Opening & Compassion",
    "Solar Plexus & Willpower",
    "Sacral & Creativity",
    "Third Eye & Intuition",
    "Throat & Expression",
    "Crown & Spiritual Connection",
    "Protective & Warding",
    "Cleansing & Purification"
];

const HEALING_FOCUS = [
    "Stress & Anxiety",
    "Digestive Health",
    "Sleep & Dreaming",
    "Energy & Vitality",
    "Skin & Radiance",
    "Immune Support",
    "Emotional Balance",
    "Hormonal Harmony"
];

export default function PantryPromptBuilder({ onBack }: PantryPromptBuilderProps) {
    const [config, setConfig] = useState({
        count: 5,
        categories: [] as string[],
        focusHealing: [] as string[],
        tone: "Educational and Mystical—blending botanical science with energetic wisdom",
        includeJsonInstructions: true
    });

    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [copied, setCopied] = useState(false);

    // Toggle Category
    const toggleCategory = (cat: string) => {
        setConfig(prev => {
            const exists = prev.categories.includes(cat);
            if (exists) return { ...prev, categories: prev.categories.filter(c => c !== cat) };
            return { ...prev, categories: [...prev.categories, cat] };
        });
    };

    // Toggle Healing Focus
    const toggleHealing = (focus: string) => {
        setConfig(prev => {
            const exists = prev.focusHealing.includes(focus);
            if (exists) return { ...prev, focusHealing: prev.focusHealing.filter(f => f !== focus) };
            return { ...prev, focusHealing: [...prev.focusHealing, focus] };
        });
    };

    // Generate Prompt Effect
    useEffect(() => {
        const categoryList = config.categories.length > 0
            ? config.categories.map(c => `- ${c}`).join('\n')
            : CATEGORIES.map(c => `- ${c}`).join('\n');

        const focusList = config.focusHealing.length > 0
            ? config.focusHealing.map(f => `- ${f}`).join('\n')
            : HEALING_FOCUS.map(f => `- ${f}`).join('\n');

        let prompt = `
> **Role**: You are a Master Herbalist and Alchemist. Your voice is "${config.tone}".
>
> **Task**: Generate ${config.count} unique "Herb Profile" entries for the Healing Pantry.
>
> **Categories to cover**: 
${categoryList}
>
> **Healing Focuses to prioritize**:
${focusList}
>
> **For each herb, provide:**
> 1. **Name**: The common name of the herb.
> 2. **Slug**: A URL-friendly slug (e.g., "holy-basil").
> 3. **Healing Attributes**: A list of 3-5 specific healing properties.
> 4. **Description**: A poetic yet informative description (2-3 sentences).
> 5. **Physical Benefits**: Scientific/biological benefits for the body.
> 6. **Emotional/Spiritual Benefits**: Metaphysical and energetic properties.
> 7. **Usage/Ritual**: How to work with the herb (tea, tincture, bath, etc.).
> 8. **General Benefits Summary**: A concise 1-sentence summary of its power.
`.trim();

        if (config.includeJsonInstructions) {
            prompt += `\n\n
> **IMPORTANT**: Output the result as a STRICT JSON Array of Objects for database import.
>
> **Schema**:
> - name (String)
> - slug (String)
> - category (String - must match list above)
> - healing (Array of Strings)
> - description (String)
> - physical (String)
> - emotional (String)
> - benefits (String)
> - usage (String)
> - recommendedProducts (Array of Objects: { productId: String, note: String }) - Keep empty for now
>
> **Example**:
> [{"name": "Tulsi (Holy Basil)", "slug": "holy-basil", "category": "Grounding & Roots", "healing": ["Stress Relief", "Adaptogen"], "description": "Known as the 'Queen of Herbs', Tulsi is a sacred balm for the modern soul...", "physical": "Lowers cortisol and supports respiratory health...", "emotional": "Builds spiritual resilience and clears the mind...", "benefits": "The ultimate adaptogen for stress-induced fatigue.", "usage": "Steep 1 tsp of dried leaves in hot water for 7 minutes.", "recommendedProducts": []}]
`;
        }

        setGeneratedPrompt(prompt);
    }, [config]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#0A0D14] p-4 sm:p-10 rounded-[40px] border border-slate-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                        <Sparkles className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Pantry <span className="text-emerald-500">Alchemist</span></h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">AI Data Generation Engine</p>
                    </div>
                </div>
                <Button 
                    onClick={onBack} 
                    variant="outline"
                    className="rounded-xl border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 px-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Pantry
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Configuration Panel */}
                <div className="space-y-8">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Herb Count</label>
                                <input
                                    type="number"
                                    className="w-full p-4 bg-[#0A0D14] border border-slate-800 rounded-2xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={config.count}
                                    onChange={e => setConfig({ ...config, count: parseInt(e.target.value) || 5 })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">AI Tone / Persona</label>
                                <select
                                    className="w-full p-4 bg-[#0A0D14] border border-slate-800 rounded-2xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={config.tone}
                                    onChange={e => setConfig({ ...config, tone: e.target.value })}
                                >
                                    <option>Educational and Mystical</option>
                                    <option>Clinical and Scientific</option>
                                    <option>Poetic and Spiritual</option>
                                    <option>Practical and Simple</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Botanical Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${config.categories.includes(cat)
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-[#0A0D14] border-slate-800 text-slate-500 hover:border-slate-600'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Healing Priorities</label>
                            <div className="flex flex-wrap gap-2">
                                {HEALING_FOCUS.map(focus => (
                                    <button
                                        key={focus}
                                        onClick={() => toggleHealing(focus)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${config.focusHealing.includes(focus)
                                                ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                : 'bg-[#0A0D14] border-slate-800 text-slate-500 hover:border-slate-600'
                                            }`}
                                    >
                                        {focus}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="bg-slate-900/50 rounded-[32px] p-8 border border-slate-800 flex flex-col h-full min-h-[500px] relative">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Prompt Output</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={config.includeJsonInstructions}
                                onChange={e => setConfig({ ...config, includeJsonInstructions: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-700 bg-[#0A0D14] text-emerald-500 focus:ring-0"
                            />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-300 transition-colors">JSON Schema</span>
                        </label>
                    </div>

                    <textarea
                        className="flex-1 w-full bg-[#0A0D14] text-emerald-500/80 font-mono text-[11px] p-6 rounded-2xl border border-slate-800 outline-none resize-none mb-20 leading-relaxed shadow-inner"
                        value={generatedPrompt}
                        readOnly
                    />

                    <div className="absolute bottom-8 right-8 left-8">
                        <button
                            onClick={handleCopy}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl ${copied
                                    ? 'bg-emerald-500 text-white transform scale-[1.02]'
                                    : 'bg-white text-slate-900 hover:bg-slate-200 hover:scale-[1.02]'
                                }`}
                        >
                            {copied ? <><Check size={18} /> Copied to Clipboard</> : <><Copy size={18} /> Forge Data Prompt</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
