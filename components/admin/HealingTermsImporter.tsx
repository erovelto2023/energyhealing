"use client";

import { useState, useTransition } from "react";
import { importHealingTerms, seedHealingData } from "@/lib/actions";
import { FileText, Save, List, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function HealingTermsImporter() {
    const [isPending, startTransition] = useTransition();
    const [importData, setImportData] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleImport = async () => {
        if (!importData.trim()) {
            setMessage("Please paste some data first.");
            setStatus("error");
            return;
        }

        // We pass the raw data to the server. 
        // The server action 'importHealingTerms' now detects JSON vs String automatically.
        const finalData = importData;

        startTransition(async () => {
            const result = await importHealingTerms(finalData);
            if (result.error) {
                setMessage("Error: " + result.error);
                setStatus("error");
            } else {
                setMessage(`Successfully imported ${result.count} healing terms!`);
                setStatus("success");
                setImportData("");
            }
        });
    };

    const handleSeed = async () => {
        setMessage("");
        startTransition(async () => {
            const result = await seedHealingData();
            if (result.error) {
                setMessage("Error: " + result.error);
                setStatus("error");
            } else {
                setMessage(`Successfully seeded energy healing library!`);
                setStatus("success");
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Healing Terms Importer</h2>
                    <p className="text-sm text-slate-500">Import energy healing concepts and definitions</p>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={handleSeed}
                        disabled={isPending}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Save size={14} /> Seed Base Library
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Data Input (JSON or Hash-Separated)
                    </label>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='Term # Meaning # Application # Category OR [{"term": "...", "meaning": "..."}]'
                        className="w-full h-96 p-4 rounded-xl border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <List size={18} className="text-indigo-600" />
                            Import Formats
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-black text-indigo-600 uppercase mb-2">Option 1: JSON Array</p>
                                <pre className="text-[10px] text-slate-600 font-mono overflow-x-auto">
                                    {`[
  { 
    "term": "Chakra", 
    "category": "Energy Systems",
    "definition": "Energy center...", 
    "application": {
      "howItWorks": "...",
      "benefits": "..."
    },
    "energy": {
      "type": "Subtle",
      "frequency": "High"
    },
    "learning": {
      "explanation": "...",
      "practice": "..."
    },
    "seo": {
      "keywords": ["energy", "healing"],
      "metaDescription": "..."
    }
  }
]`}
                                </pre>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-black text-indigo-600 uppercase mb-2">Option 2: Hash Separated (#)</p>
                                <p className="text-[11px] text-slate-600 font-mono leading-loose">
                                    Term # Meaning # Application # Category # ToolIDs
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <p className="text-xs font-black text-slate-500 uppercase mb-2">Example Entry</p>
                                <p className="text-[11px] text-slate-600 font-mono">
                                    Reiki # Japanese energy healing # Sessions are 60 mins # Modality # 101, 102
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <AlertCircle size={16} />
                            Energy Healing Focus
                        </h4>
                        <ul className="text-xs text-indigo-800 space-y-2 list-disc pl-4">
                            <li>These terms will be tagged with the <strong>"Energy Healing"</strong> niche.</li>
                            <li>They will automatically appear on the <strong>/writing</strong> (Healing Dictionary) page.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleImport}
                    disabled={isPending || !importData}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Importing Terms...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Process and Import Healing Terms
                        </>
                    )}
                </button>

                {status !== 'idle' && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                        {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
