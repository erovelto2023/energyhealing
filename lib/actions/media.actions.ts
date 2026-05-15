"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/db";
import Resource from "@/lib/models/Resource";
import { saveFile, deleteFile } from "@/lib/storage";
import { validateAdmin } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { escapeRegExp } from "@/lib/utils";

/**
 * Uploads a file to local storage and creates a database record.
 */
export async function uploadMedia(formData: FormData) {
    try {
        const user = await validateAdmin();
        if (!user) throw new Error("Unauthorized");

        const file = formData.get("file") as File;
        if (!file) throw new Error("No file provided");

        const category = (formData.get("category") as string) || "General";
        const title = (formData.get("title") as string) || file.name;

        // Save to filesystem
        const url = await saveFile(file);

        // Determine type and mimeType
        let type: "image" | "pdf" | "file" = "file";
        const mimeType = file.type;
        if (mimeType.startsWith("image/")) {
            type = "image";
        } else if (mimeType === "application/pdf") {
            type = "pdf";
        }

        await connectToDatabase();
        const resource = await Resource.create({
            title,
            url,
            type,
            category,
            mimeType,
            fileSizeBytes: file.size,
            originalFilename: file.name,
            storedFilename: url.split('/').pop(),
            isPublished: true,
            status: 'published',
            altText: title,
            thumbnailUrl: type === 'image' ? url : undefined,
        });

        revalidatePath("/admin/media");
        return { success: true, data: JSON.parse(JSON.stringify(resource)) };
    } catch (error: any) {
        console.error("[uploadMedia] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all resources with filtering.
 */
export async function getResources(options: { 
    query?: string; 
    category?: string; 
    type?: string; 
    status?: string;
} = {}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const MAIN_SITE = "https://kbusinessacademy.com";
        const url = new URL(`${MAIN_SITE}/api/gallery`);
        
        if (options.query) url.searchParams.set("query", options.query);
        if (options.category) url.searchParams.set("category", options.category);
        if (options.status) url.searchParams.set("status", options.status);
        // The external API uses 'limit' but we can just fetch default for now
        url.searchParams.set("limit", "100");

        console.log("[getResources] Fetching from external vault:", url.toString());
        const response = await fetch(url.toString(), {
            next: { revalidate: 60 } // Cache for 1 minute
        });
        
        if (!response.ok) throw new Error("Failed to fetch from main media site");
        
        const result = await response.json();
        
        if (!result.success) throw new Error(result.error || "External API error");

        // Map external structure to local structure if necessary
        // Local expects: _id, title, url, type, category, mimeType, fileSizeBytes, status, altText, thumbnailUrl, tags
        // External provides: _id, title, altText, description, tags, fileUrl, thumbnailUrl, mimeType, fileSizeBytes, status, createdAt, category
        const mappedData = result.images.map((img: any) => ({
            _id: img._id,
            title: img.title,
            url: img.fileUrl, // Map fileUrl to url
            thumbnailUrl: img.thumbnailUrl,
            type: img.mimeType?.startsWith("image/") ? "image" : (img.mimeType === "application/pdf" ? "pdf" : "file"),
            category: img.category,
            mimeType: img.mimeType,
            fileSizeBytes: img.fileSizeBytes,
            status: img.status,
            altText: img.altText,
            tags: img.tags,
            createdAt: img.createdAt
        }));

        // Client side filtering for 'warehouse' if needed, though the API might handle it
        let finalData = mappedData;
        if (options.type && options.type !== 'all') {
            if (options.type === 'warehouse') {
                finalData = mappedData.filter((a: any) => a.type !== 'image');
            } else if (options.type === 'image') {
                finalData = mappedData.filter((a: any) => a.type === 'image');
            } else {
                finalData = mappedData.filter((a: any) => a.type === options.type);
            }
        }

        console.log("[getResources] Successfully pulled from external vault. Count:", finalData.length);
        return { success: true, data: finalData };
    } catch (error: any) {
        console.error("[getResources] Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates a resource record.
 */
export async function updateResource(id: string, data: any) {
    try {
        const user = await validateAdmin();
        if (!user) throw new Error("Unauthorized");

        return { 
            success: false, 
            error: "This asset is managed by kbusinessacademy.com. Please perform updates on the main site to ensure consistency across the network." 
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Deletes a resource from DB and disk.
 */
export async function removeResource(id: string) {
    try {
        const user = await validateAdmin();
        if (!user) throw new Error("Unauthorized");

        return { 
            success: false, 
            error: "Deletion is restricted in the Universal Media Center. Please purge this asset from the main site (kbusinessacademy.com) to remove it from the network." 
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Increment download count
 */
export async function incrementDownload(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();
        await Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
