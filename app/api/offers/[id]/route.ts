import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/lib/models/Offer';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        // Try deleting by ID first
        let deleted = null;
        if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
            deleted = await Offer.findByIdAndDelete(params.id);
        }

        // If not found by ID (or ID invalid format), try slug
        if (!deleted) {
            deleted = await Offer.findOneAndDelete({ slug: params.id });
        }

        if (!deleted) {
            return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
