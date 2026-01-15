"use client";

import { useState, useTransition } from "react";
import { bulkCreateGlossaryTerms } from "@/lib/actions";
import { FileText, Save, List, AlertCircle, CheckCircle } from "lucide-react";

export default function GlossaryImporter() {
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

        let parsedData;
        const trimmedData = importData.trim();
        const isJsonPrompt = trimmedData.startsWith('[') || trimmedData.startsWith('{');

        try {
            // Try parsing as JSON if it looks like JSON
            if (isJsonPrompt) {
                parsedData = JSON.parse(trimmedData);
                if (!Array.isArray(parsedData)) {
                    setMessage("JSON must be an array of objects.");
                    setStatus("error");
                    return;
                }
            } else {
                throw new Error("Fallback to text");
            }
        } catch (e: any) {
            // If it looked like JSON but failed, it's a syntax error
            if (isJsonPrompt) {
                setMessage(`JSON Error: ${e.message}. Please check your syntax.`);
                setStatus("error");
                return;
            }
            // If JSON fails, split into lines
            const lines = importData.split("\n").filter(line => line.trim());
            if (lines.length < 1) {
                setMessage("No data found in the input.");
                setStatus("error");
                return;
            }

            // Detect and skip header row
            let startIdx = 0;
            const firstLine = lines[0].toLowerCase();
            if (firstLine.includes("term|") || (firstLine.includes("term") && firstLine.includes("definition"))) {
                startIdx = 1;
            }

            try {
                parsedData = lines.slice(startIdx).map((line, idx) => {
                    // Smart delimiter detection: Prefer |, then check # or Tab
                    let delimiter = "|";
                    if (!line.includes("|")) {
                        if (line.includes("#")) delimiter = "#";
                        else if (line.includes("\t")) delimiter = "\t";
                    }

                    const parts = line.split(delimiter).map(p => p.trim());

                    // We need at least 2 parts (Term and some form of definition)
                    if (parts.length < 2) {
                        throw new Error(`Line ${idx + startIdx + 1} is missing data. Use '${delimiter}' to separate columns.`);
                    }

                    return {
                        term: parts[0],
                        niche: parts[1] || "General",
                        shortDefinition: parts[2] || parts[3] || parts[0],
                        definition: parts[3] || parts[2] || parts[0],
                        synonyms: parts[4] ? parts[4].split(",").map(s => s.trim()).filter(Boolean) : [],
                        recommendedToolIds: parts[5] ? parts[5].split(",").map(s => s.trim()).filter(Boolean) : []
                    };
                });
            } catch (err: any) {
                setMessage(err.message || "Failed to parse data. Ensure each line uses the | separator.");
                setStatus("error");
                return;
            }
        }

        startTransition(async () => {
            const result = await bulkCreateGlossaryTerms(parsedData);
            if (result.error) {
                setMessage("Error: " + result.error);
                setStatus("error");
            } else {
                setMessage(`Successfully imported ${result.count} terms!`);
                setStatus("success");
                setImportData("");
            }
        });
    };

    const template = `[
  {
    "term": "SEO",
    "niche": "SEO",
    "shortDefinition": "Search Engine Optimization",
    "definition": "The process of optimizing your website to rank higher in search engines.",
    "synonyms": ["Search Engine Marketing", "Organic Search"],
    "recommendedToolIds": [1, 2]
  }
]`;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Bulk Content Importer</h2>
                    <p className="text-sm text-slate-500">Import multiple glossary terms at once</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Data Input (JSON or Pipe-Separated)
                    </label>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste your JSON array or | separated lines here..."
                        className="w-full h-96 p-4 rounded-xl border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <List size={18} className="text-blue-600" />
                            Import Formats
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Option 1: JSON (Recommended)</p>
                                <pre className="bg-slate-900 text-blue-300 p-4 rounded-lg text-[11px] overflow-x-auto">
                                    {template}
                                </pre>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Option 2: Separated Text (|, #, or Tab)</p>
                                <p className="text-[11px] text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                                    Term | Niche | Short Def | Long Def | Synonyms | Tools<br />
                                    <span className="text-blue-500 italic mt-1 block">Quick format: Term | Long Definition</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <AlertCircle size={16} />
                            Smart Features
                        </h4>
                        <ul className="text-xs text-blue-800 space-y-2 list-disc pl-4">
                            <li><strong>Skip Headers</strong>: You can include your spreadsheet header row; it will be skipped automatically.</li>
                            <li><strong>Smart Mapping</strong>: If you only provide 2 columns (Term and Definition), we'll handle the rest!</li>
                            <li><strong>Multiple Symbols</strong>: Use pipes (|), hashes (#), or even just copy-paste directly from Excel/Sheets (Tabs).</li>
                            <li><strong>Clear Errors</strong>: We'll tell you exactly which line is causing an issue.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleImport}
                    disabled={isPending || !importData}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Importing Data...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Process and Import Glossary Terms
                        </>
                    )}
                </button>

                {status !== 'idle' && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${status === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                        {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
