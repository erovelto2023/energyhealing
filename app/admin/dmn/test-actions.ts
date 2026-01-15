"use server";

import connectToDatabase from '@/lib/db';
import Product from '@/lib/models/Product';
import { revalidatePath } from 'next/cache';

export async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');
        await connectToDatabase();
        console.log('✅ Connected to database');

        const count = await Product.countDocuments();
        console.log(`📊 Found ${count} products in database`);

        return { success: true, count, message: `Database connected. Found ${count} products.` };
    } catch (error: any) {
        console.error('❌ Database connection error:', error);
        return { error: error.message };
    }
}

export async function testDeleteProduct(productId: number) {
    try {
        console.log('🧪 TEST: Attempting to delete product:', productId);
        await connectToDatabase();

        // First, check if product exists
        const existing = await Product.findOne({ id: productId });
        console.log('🔍 Product exists?', existing ? 'YES' : 'NO');

        if (!existing) {
            return { error: 'Product not found', productId };
        }

        // Try to delete
        const result = await Product.deleteOne({ id: productId });
        console.log('🗑️ Delete result:', result);

        revalidatePath('/admin');

        return { success: true, deleted: result.deletedCount > 0 };
    } catch (error: any) {
        console.error('❌ Test delete error:', error);
        return { error: error.message };
    }
}
