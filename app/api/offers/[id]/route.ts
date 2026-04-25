import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/lib/models/Offer';
import { validateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await validateAdmin();
        const { id } = await params;
        await connectToDatabase();

        // Try deleting by ID first
        let deleted = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            deleted = await Offer.findByIdAndDelete(id);
        }

        // If not found by ID (or ID invalid format), try slug
        if (!deleted) {
            deleted = await Offer.findOneAndDelete({ slug: id });
        }

        if (!deleted) {
            return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
