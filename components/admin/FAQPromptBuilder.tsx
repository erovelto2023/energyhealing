import { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface FAQPromptBuilderProps {
    onBack: () => void;
}

const MASTER_PROMPT = `# Master Prompt for Generating FAQ JSON

**Role:**
You are an expert SEO Content Strategist and Holistic Health Researcher. Your task is to take raw spreadsheet data (Questions, Parent Questions, and Source Links) and transform it into a rich, structured JSON format for a "Knowledge Base" application.

**Goal:**
For each row of data provided, generate a JSON object that strictly follows the schema below. You must synthesize the "Deep Dive" content based on the Question and the provided Source Text (or general expert knowledge if the source text is thin).

---

### **Input Format (Spreadsheet Columns)**
1. **Question**: The main user query (e.g., "What is yoga therapy?").
2. **Parent Question**: The broader category (e.g., "Yoga Therapy").
3. **Link Title**: Title of the reference article.
4. **Link**: URL of the reference.
5. **Text**: A raw snippet from the source.

---

### **Required JSON Output Structure**
Return a **SINGLE JSON ARRAY** containing objects with these exact fields:

\`\`\`json
[
  {
    "question": "Exact string from input",
    "parentQuestion": "Exact string from input",
    "slug": "", // Leave empty, system will auto-generate
    "h1Title": "A compelling, SEO-optimized H1 title (e.g., 'What Is Yoga Therapy? A Clinical Perspective')",
    "answerSnippet": "A direct, featured-snippet style answer (40-60 words). Bold key terms if possible.",
    "deepDive": {
      "problem": "The 'Pain Point': Why is the user asking this? What confusion or suffering are they trying to resolve? (2-3 sentences)",
      "methodology": "The 'Science/Theory': How does this concept work? Cite the provided source text or general principles here. (2-3 sentences)",
      "application": "The 'Practice': How is this applied in real life or a clinical session? Give a concrete example. (2-3 sentences)"
    },
    "linkTitle": "Exact string from input",
    "linkUrl": "Exact string from input",
    "sourceText": "Exact string from input"
  }
]
\`\`\`

---

### **Content Guidelines**
1.  **Tone**: Professional, empathetic, clinical yet holistic. Avoid fluff.
2.  **H1 Title**: Make it catchy but clear. Use "How-to", "Guide", or "Explained" formats.
3.  **Answer Snippet**: This is for the "Quick Answer" box. Start with the direct answer immediately.
4.  **Deep Dive**:
    *   **Problem**: Focus on the user's hidden anxiety or curiosity.
    *   **Methodology**: Use independent, objective language ("Studies show...", "The framework suggests...").
    *   **Application**: Focus on the *doing*. "In a session, you might..."

---

### **Refusal / Error Handling**
*   If a row has "not-given" for the text, use your own expert knowledge to fill in the \`deepDive\` and \`answerSnippet\` fields responsibly.
*   Do not output markdown code blocks (like \`\`\`json), just the raw JSON text so I can copy-paste it directly.

---

### **YOUR TASK**
Convert the following data rows into the JSON format described above:
`;

export default function FAQPromptBuilder({ onBack }: FAQPromptBuilderProps) {
    const [inputData, setInputData] = useState('');
    const [copied, setCopied] = useState(false);

    const fullPrompt = `${MASTER_PROMPT}\n\n${inputData}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">AI FAQ Prompt Builder</h2>
                        <p className="text-slate-500 text-sm">Paste your questions below to generate a prompt for ChatGPT/Claude.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Imput Side */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            1. Paste Your Data Rows
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Copy rows directly from Excel/Sheets. Format: Question | Category | Link Title | URL | Snippet
                        </p>
                        <textarea
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            className="w-full h-[500px] p-4 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder={"What is Reiki? | Energy Healing | Reiki.org | http://... | Reiki is a Japanese technique..."}
                        />
                    </div>
                </div>

                {/* Preview Side */}
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-slate-700">
                            2. Final Prompt Preview
                        </label>
                        <button
                            onClick={handleCopy}
                            disabled={!inputData.trim()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 ${copied
                                ? 'bg-green-500 shadow-green-200'
                                : 'bg-slate-900 shadow-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:scale-100 disabled:shadow-none'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={14} /> Copy Prompt
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex-1 relative border border-slate-300 rounded-xl bg-slate-50 overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="overflow-auto p-6 flex-1 text-xs font-mono text-slate-600 whitespace-pre-wrap">
                            {fullPrompt}
                        </div>

                        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center bg-opacity-95 backdrop-blur-sm">
                            <span className="text-xs font-bold text-slate-400">
                                {fullPrompt.length} characters
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
