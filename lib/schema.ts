import { IGlossaryTerm } from '@/lib/models/GlossaryTerm';

export function generateGlossarySchema(term: IGlossaryTerm, baseUrl: string = 'http://localhost:3000') {
    return {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.shortDefinition || term.definition?.substring(0, 200),
        url: `${baseUrl}/glossary/${term.slug || term.id}`,
        inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: 'Kathleen Heals Energy Healing Glossary',
            description: 'Comprehensive glossary of energy healing, spiritual wellness, and holistic health terms'
        },
        ...(term.category && {
            termCode: term.category
        }),
        ...(term.synonyms && term.synonyms.length > 0 && {
            alternateName: term.synonyms
        })
    };
}

export function generateArticleSchema(term: IGlossaryTerm, baseUrl: string = 'http://localhost:3000') {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: term.term,
        description: term.shortDefinition,
        articleBody: term.definition,
        author: {
            '@type': 'Person',
            name: 'Kathleen',
            url: baseUrl
        },
        publisher: {
            '@type': 'Organization',
            name: 'Kathleen Heals',
            url: baseUrl
        },
        ...(term.keywords && {
            keywords: term.keywords.join(', ')
        }),
        ...(term.updatedAt && {
            dateModified: term.updatedAt,
            datePublished: term.createdAt || term.updatedAt
        }),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/glossary/${term.slug || term.id}`
        }
    };
}

export function generateFAQSchema(term: IGlossaryTerm) {
    const questions = [];

    if (term.howItWorks) {
        questions.push({
            '@type': 'Question',
            name: `How does ${term.term} work?`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: term.howItWorks
            }
        });
    }

    if (term.benefits) {
        questions.push({
            '@type': 'Question',
            name: `What are the benefits of ${term.term}?`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: term.benefits
            }
        });
    }

    if (term.misconceptions) {
        questions.push({
            '@type': 'Question',
            name: `What are common misconceptions about ${term.term}?`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: term.misconceptions
            }
        });
    }

    if (questions.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions
    };
}

export function generateBreadcrumbSchema(term: IGlossaryTerm, baseUrl: string = 'http://localhost:3000') {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Glossary',
                item: `${baseUrl}/glossary`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: term.term,
                item: `${baseUrl}/glossary/${term.slug || term.id}`
            }
        ]
    };
}
