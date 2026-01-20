import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

interface AffirmationPromptBuilderProps {
    onBack: () => void;
}

const CATEGORIES = [
    "Nervous System Regulation",
    "Self-Worth & Belonging",
    "Boundaries & Sovereignty",
    "Abundance & Trust",
    "Healing & Resilience",
    "Creativity & Expression",
    "Grief & Release",
    "Purpose & Alignment"
];

export default function AffirmationPromptBuilder({ onBack }: AffirmationPromptBuilderProps) {
    const [config, setConfig] = useState({
        audience: "Digital marketing beginners and entrepreneurs",
        tone: "Clinical Wisdom meets Soulful Care—grounded, scientific, yet poetic and spiritually nourishing",
        count: 10,
        categories: [] as string[],
        focusHerbs: "",
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

    // Generate Prompt Effect
    useEffect(() => {
        const categoryList = config.categories.length > 0
            ? config.categories.map(c => `- ${c}`).join('\n')
            : CATEGORIES.map(c => `- ${c}`).join('\n');

        const herbInstruction = config.focusHerbs
            ? `\n> **Specific Focus**: Please prioritize affirmations that pair well with these herbs: ${config.focusHerbs}.`
            : "";

        let prompt = `
> **Role**: You are an expert Healer and Somatic Therapist who specializes in helping ${config.audience}. Your voice is "${config.tone}".
>
> **Task**: Generate ${config.count} unique "Daily Ritual" affirmations.
>
> **Categories to cover**: 
${categoryList}
${herbInstruction}
>
> **For each affirmation, provide:**
> 1. **Title**: Poetic and evocative (2-4 words).
> 2. **Affirmation**: First-person, present tense, positive, believable.
> 3. **Intention**: The emotional/psychological purpose.
> 4. **Why It Works**: A brief explanation blending neuroscience with energetics.
> 5. **When To Use**: 2-3 specific contexts.
> 6. **Ritual Pairing**: Primary Herb, Ritual Action, Breathwork, Moon Phase.
> 7. **User Prompt**: A reflective question.
`.trim();

        if (config.includeJsonInstructions) {
            prompt += `\n\n
> **IMPORTANT**: Output the result as a STRICT JSON Array of Objects for database import.
>
> **Schema**:
> - title (String)
> - affirmation (String)
> - intention (String)
> - category (String - must match list above)
> - whenToUse (Array of Strings)
> - whyItWorks (String)
> - userPrompt (String)
> - primaryHerb (String)
> - pairing (Object: { herbs: [], rituals: [], breathwork: "", moonPhase: "" })
> - linkedGlossaryTerms (Array of Strings)
> - recommendedProductIds (Array of Strings - empty)
>
> **Example**:
> [{"title": "Rooted Calm", "affirmation": "...", "category": "Nervous System Regulation", ...}]
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
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Prompt Builder</h2>
                    <p className="text-slate-500">Configure and generate a prompt to create new rituals.</p>
                </div>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Close</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Configuration Panel */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Target Audience</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            value={config.audience}
                            onChange={e => setConfig({ ...config, audience: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tone / Persona</label>
                        <textarea
                            rows={2}
                            className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            value={config.tone}
                            onChange={e => setConfig({ ...config, tone: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Count</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={config.count}
                                onChange={e => setConfig({ ...config, count: parseInt(e.target.value) || 10 })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Specific Herbs (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Rose, Mugwort"
                                className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={config.focusHerbs}
                                onChange={e => setConfig({ ...config, focusHerbs: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Focus Categories (Select to limit)</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${config.categories.includes(cat)
                                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {config.categories.length === 0 && <p className="text-[10px] text-slate-400 mt-2 ml-1">If none selected, AI will choose freely.</p>}
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col h-full relative group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Prompt Preview</span>
                        <div className="flex gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.includeJsonInstructions}
                                    onChange={e => setConfig({ ...config, includeJsonInstructions: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-0"
                                />
                                <span className="text-xs text-slate-400 font-bold">Include JSON Schema</span>
                            </label>
                        </div>
                    </div>

                    <textarea
                        className="flex-1 w-full bg-slate-800 text-slate-300 font-mono text-xs p-4 rounded-xl outline-none resize-none mb-16"
                        value={generatedPrompt}
                        readOnly
                    />

                    <div className="absolute bottom-6 right-6 left-6">
                        <button
                            onClick={handleCopy}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${copied
                                    ? 'bg-green-500 text-white transform scale-[1.02]'
                                    : 'bg-purple-600 text-white hover:bg-purple-500 hover:scale-[1.02]'
                                }`}
                        >
                            {copied ? <><Check size={20} /> Copied to Clipboard</> : <><Copy size={20} /> Copy Prompt</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
