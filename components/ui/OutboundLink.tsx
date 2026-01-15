"use client";

import { useTransition } from "react";
import { trackProductClick } from "@/lib/actions";
import { ExternalLink } from "lucide-react";

interface OutboundLinkProps {
    href: string;
    productId: number;
    children: React.ReactNode;
    className?: string;
}

export default function OutboundLink({ href, productId, children, className }: OutboundLinkProps) {
    const [isPending, startTransition] = useTransition();

    // Ensure href has a protocol
    const finalHref = (href && !href.startsWith('http') && href !== '#')
        ? `https://${href}`
        : href;

    const handleClick = () => {
        console.log(`🔗 OutboundLink clicked: ${finalHref} (Product ID: ${productId})`);
        // Fire and forget server action to track click
        startTransition(() => {
            trackProductClick(productId);
        });
    };

    return (
        <a
            href={finalHref}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className={className}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}
