import { getProducts } from '@/lib/initialData';
import ToolsAlphabeticalList from '@/components/features/ToolsAlphabeticalList';
import { Grid } from 'lucide-react';

export default async function ToolsPage() {
    // Fetch all products to pass to the client component for alphabetical filtering
    const { products } = await getProducts({ limit: 5000 }); // High limit to get all tools

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <Grid size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tools Directory</h1>
                    </div>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl">
                        An alphabetical index of every marketing, development, and design tool in our collection.
                        Use the catalog index to find exactly what you need.
                    </p>
                </div>
            </div>

            <ToolsAlphabeticalList tools={products} />
        </div>
    );
}
