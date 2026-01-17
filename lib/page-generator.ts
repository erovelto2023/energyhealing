'use server';

import fs from 'fs/promises';
import path from 'path';

export async function generatePage(slug: string, code: string) {
    try {
        // Sanitize slug
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        if (!safeSlug) throw new Error("Invalid slug");

        // Auto-add 'use client' if hooks or event handlers are detected and directive is missing
        let finalCode = code;
        const hasHooks = code.includes('useState') || code.includes('useEffect') || code.includes('useMemo') || code.includes('useCallback');
        const hasEvents = /on[A-Z][a-zA-Z]+=\{/.test(code) || code.includes('onClick') || code.includes('onChange') || code.includes('onError') || code.includes('onSubmit');

        if ((hasHooks || hasEvents) && !code.includes("'use client'") && !code.includes('"use client"')) {
            finalCode = "'use client';\n\n" + code;
        }

        // Always add @ts-nocheck to prevent build errors on pasted code
        if (!finalCode.includes('// @ts-nocheck')) {
            finalCode = "// @ts-nocheck\n" + finalCode;
        }

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

export async function getPageContent(slug: string) {
    try {
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const filePath = path.join(process.cwd(), 'app', 'offers', safeSlug, 'page.tsx');

        const content = await fs.readFile(filePath, 'utf-8');
        return { success: true, content };
    } catch (error: any) {
        return { success: false, error: "File not found or unreadable" };
    }
}

export async function deletePage(slug: string) {
    try {
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const dir = path.join(process.cwd(), 'app', 'offers', safeSlug);

        await fs.rm(dir, { recursive: true, force: true });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
