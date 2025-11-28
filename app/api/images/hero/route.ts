import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    try {
        const imagesDir = path.join(process.cwd(), 'public', 'images', 'hero-slideshow')

        // Check if directory exists
        if (!fs.existsSync(imagesDir)) {
            return NextResponse.json({ images: [] })
        }

        const files = fs.readdirSync(imagesDir)

        // Filter for image files only
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => `/images/hero-slideshow/${file}`)

        return NextResponse.json({ images })
    } catch (error) {
        console.error('Error reading hero images:', error)
        return NextResponse.json({ error: 'Failed to load images' }, { status: 500 })
    }
}
