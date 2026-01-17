'use server';

import fs from 'fs/promises';
import path from 'path';

export async function generatePage(slug: string, code: string) {
    try {
        // Sanitize slug
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        if (!safeSlug) throw new Error("Invalid slug");

        // Auto-add 'use client' if hooks are detected and directive is missing
        let finalCode = code;
        if ((code.includes('useState') || code.includes('useEffect') || code.includes('useMemo')) && !code.includes("'use client'") && !code.includes('"use client"')) {
            finalCode = "'use client';\n\n" + code;
        }

        // Always add @ts-nocheck to prevent build errors on pasted code
        finalCode = "// @ts-nocheck\n" + finalCode;

        const dir = path.join(process.cwd(), 'app', 'offers', safeSlug);
        await fs.mkdir(dir, { recursive: true });

        const filePath = path.join(dir, 'page.tsx');
        await fs.writeFile(filePath, finalCode, 'utf-8');

        return { success: true, url: `/offers/${safeSlug}` };
    } catch (error: any) {
        console.error("Error generating page:", error);
        return { error: error.message };
    }
}
