import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/lib/models/Offer';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const offers = await Offer.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, offers });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await connectToDatabase();

        // Validation
        if (!body.slug || !body.content) {
            return NextResponse.json({ success: false, error: "Slug and Content are required." }, { status: 400 });
        }

        // Check for existing slug to update
        const existing = await Offer.findOne({ slug: body.slug });
        if (existing) {
            existing.content = body.content;
            if (body.title) existing.title = body.title;
            existing.updatedAt = new Date();
            await existing.save();
            return NextResponse.json({ success: true, offer: existing, action: 'updated' });
        }

        // Create new
        const newOffer = await Offer.create({
            title: body.title || body.slug,
            slug: body.slug,
            content: body.content,
            isPublished: true
        });

        return NextResponse.json({ success: true, offer: newOffer, action: 'created' });
    } catch (error: any) {
        console.error("Error creating/updating offer:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
