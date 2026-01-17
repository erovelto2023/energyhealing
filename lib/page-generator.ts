'use server';

import fs from 'fs/promises';
import path from 'path';

export async function generatePage(slug: string, code: string) {
    try {
        let finalCode = code;
        let finalSlug = slug;

        // Auto-Generate Slug if missing: Try to find H1
        if (!finalSlug || finalSlug.trim() === '') {
            const h1Match = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
            if (h1Match && h1Match[1]) {
                // Strip tags and special chars
                const text = h1Match[1].replace(/<[^>]*>/g, '').trim();
                finalSlug = text;
            } else {
                finalSlug = `offer-${Date.now()}`;
            }
        }

        // Sanitize slug
        const safeSlug = finalSlug.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        if (!safeSlug) throw new Error("Invalid slug generated");

        // Logic: specific handling for raw HTML vs React Component
        if (!code.includes('export default')) {
            // It's likely raw HTML. Auto-wrap it.
            let jsx = code
                .replace(/class=/g, 'className=')
                .replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}')
                .replace(/<br>/g, '<br />')
                .replace(/<hr>/g, '<hr />');

            // Fix self-closing tags (img, input)
            jsx = jsx.replace(/<(img|input)([^>]*)(?<!\/)>/gi, '<$1$2 />');

            finalCode = `// @ts-nocheck
'use client';
import React from 'react';
import { 
  Star, Award, Info, ShoppingCart, ArrowRight, Check, Menu, X, 
  ChevronDown, ChevronRight, ShieldCheck, TrendingUp, Box, Scale 
} from 'lucide-react';

export default function GeneratedPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      ${jsx}
    </div>
  );
}`;
        } else {
            // Already a React Component. Apply standard fixes.
            let prefix = "";
            const hasHooks = code.includes('useState') || code.includes('useEffect') || code.includes('useMemo');
            const hasEvents = /on[A-Z][a-zA-Z]+=\{/.test(code) || code.includes('onClick');

            if ((hasHooks || hasEvents) && !code.includes("'use client'")) {
                prefix += "'use client';\n\n";
            }
            if (!code.includes('// @ts-nocheck')) {
                prefix = "// @ts-nocheck\n" + prefix;
            }
            finalCode = prefix + code;
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
