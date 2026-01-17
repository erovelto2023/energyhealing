import { getPendingReviews, getProducts, getGlossaryTerms } from '@/lib/initialData';
import fs from 'fs';
import path from 'path';
import { getNiches, getSubscribers } from '@/lib/actions';
import { clearAllData, migrateToSlugs, importOffersFromFS } from './actions';
import { testDatabaseConnection } from './test-actions';
import AdminDashboard from '@/components/admin/AdminDashboard';
import connectToDatabase from '@/lib/db';
import Offer from '@/lib/models/Offer';
import { Lock, Trash2, TestTube, RefreshCw, Download } from 'lucide-react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function TestDatabaseButton() {
    async function handleTest() {
        "use server";
        const result = await testDatabaseConnection();
        console.log('Test result:', result);
    }

    return (
        <form action={handleTest}>
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <TestTube size={16} />
                Test DB
            </button>
        </form>
    );
}

async function ClearDatabaseButton() {
    async function handleClear() {
        "use server";
        const result = await clearAllData();
        if (result.success) {
            redirect('/admin');
        }
    }

    return (
        <form action={handleClear}>
            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <Trash2 size={16} />
                Clear All Data
            </button>
        </form>
    );
}

async function MigrateSlugsButton() {
    async function handleMigrate() {
        "use server";
        const result = await migrateToSlugs();
        if (result.success) {
            redirect('/admin');
        }
    }

    return (
        <form action={handleMigrate}>
            <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <RefreshCw size={16} />
                Generate Slugs
            </button>
        </form>
    );
}


async function ImportOffersButton() {
    async function handleImport() {
        "use server";
        const result = await importOffersFromFS();
        if (result.success) {
            console.log(result.message);
            // Cannot alert from server action easily, but redirect refreshes content
            redirect('/admin/dmn');
        }
    }

    return (
        <form action={handleImport}>
            <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <Download size={16} />
                Import Offers
            </button>
        </form>
    );
}

export default async function AdminPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const reviews = await getPendingReviews();
    const { products } = await getProducts({});
    // Fetch all terms with a high limit to ensure admin dashboard sees everything
    const { terms: glossaryTerms } = await getGlossaryTerms({ limit: 10000 });
    const niches = await getNiches();
    const subscribers = await getSubscribers();

    // Fetch offers from DB
    await connectToDatabase();
    const offersData = await Offer.find({}).sort({ createdAt: -1 }).lean();
    const salesPages = JSON.parse(JSON.stringify(offersData));

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                        <Lock className="mr-3 text-slate-400" /> Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                            <TestDatabaseButton />
                            <ClearDatabaseButton />
                            <MigrateSlugsButton />
                            <ImportOffersButton />
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full text-slate-600 text-sm font-medium shadow-sm border border-slate-200">
                            Logged in as {(await currentUser())?.firstName || 'Admin'}
                        </div>
                    </div>
                </div>

                <AdminDashboard
                    reviews={reviews}
                    products={products}
                    glossaryTerms={glossaryTerms}
                    niches={niches}
                    subscribers={subscribers}
                    salesPages={salesPages}
                />
            </div>
        </div>
    );
}

