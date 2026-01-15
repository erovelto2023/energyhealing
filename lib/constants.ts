export const NICHES = [
    { id: 'all', label: 'All Niches' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'productivity', label: 'Productivity' }
];

export const PRICE_MODELS = [
    { id: 'all', label: 'Any Price' },
    { id: 'Free', label: 'Free / Open Source' },
    { id: 'Freemium', label: 'Freemium' },
    { id: 'Subscription', label: 'Paid Subscription' }
];

export const PAIN_POINTS = [
    { id: 'traffic', label: 'I need more website traffic', niches: ['marketing'], tags: ['seo', 'ads'] },
    { id: 'leads', label: 'I need to capture emails/leads', niches: ['marketing'], tags: ['newsletter', 'crm'] },
    { id: 'coding', label: 'I need to write or manage code', niches: ['development'], tags: ['editor', 'git'] },
    { id: 'design', label: 'I need to design graphics/UI', niches: ['design'], tags: ['vector', 'prototyping'] },
    { id: 'chaos', label: 'My work is disorganized', niches: ['productivity'], tags: ['organization', 'notes'] },
];

export const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: 'MailChimp',
        niche: 'marketing',
        category: 'Email Marketing',
        rating: 4.5,
        reviewsCount: 1204,
        description: 'All-in-one marketing platform for small business. Manage campaigns and audiences.',
        priceModel: 'Freemium',
        deal: 'Get 30% off first 3 months',
        tags: ['newsletter', 'automation', 'leads'],
        featured: true,
        logoColor: 'bg-yellow-400',
        pros: ['User-friendly interface', 'Great free plan for beginners', 'Excellent integrations'],
        cons: ['Pricing scales steeply', 'Automation features limited on lower tiers'],
        features: ['Email Builder', 'A/B Testing', 'Landing Pages', 'Marketing CRM'],
        userReviews: [
            { user: 'Sarah J.', rating: 5, comment: 'Best tool for starting out. The free tier is generous.', date: '2023-10-15' },
            { user: 'Mike T.', rating: 4, comment: 'Good features but gets expensive fast.', date: '2023-11-02' }
        ]
    },
    {
        id: 2,
        name: 'SEMRush',
        niche: 'marketing',
        category: 'SEO',
        rating: 4.8,
        reviewsCount: 3500,
        description: 'Online visibility management platform. SEO, PPC, content, social media and competitive research.',
        priceModel: 'Subscription',
        deal: '7-Day Free Trial',
        tags: ['seo', 'analytics', 'traffic'],
        featured: true,
        logoColor: 'bg-orange-500',
        pros: ['Massive keyword database', 'Comprehensive competitor analysis', 'All-in-one suite'],
        cons: ['Steep learning curve', 'Expensive for small teams'],
        features: ['Keyword Magic Tool', 'Site Audit', 'Backlink Analytics', 'Rank Tracking'],
        userReviews: [
            { user: 'Alex D.', rating: 5, comment: 'The keyword magic tool is a game changer.', date: '2023-09-20' }
        ]
    },
    {
        id: 3,
        name: 'VS Code',
        niche: 'development',
        category: 'IDE',
        rating: 4.9,
        reviewsCount: 8000,
        description: 'Code editing. Redefined. Free. Built on open source. Runs everywhere.',
        priceModel: 'Free',
        deal: '',
        tags: ['editor', 'coding'],
        featured: false,
        logoColor: 'bg-blue-500',
        pros: ['Completely free', 'Huge extension marketplace', 'Lightweight'],
        cons: ['Setup required for advanced workflows', 'Can be resource heavy with too many plugins'],
        features: ['IntelliSense', 'Git Built-in', 'Extensions', 'Debugging'],
        userReviews: []
    },
    {
        id: 4,
        name: 'Figma',
        niche: 'design',
        category: 'UI/UX',
        rating: 4.7,
        reviewsCount: 2100,
        description: 'Connects everyone in the design process so teams can deliver better products, faster.',
        priceModel: 'Freemium',
        deal: 'Free for Students',
        tags: ['vector', 'prototyping', 'design'],
        featured: true,
        logoColor: 'bg-purple-500',
        pros: ['Real-time collaboration', 'Browser-based (no install)', 'Community files'],
        cons: ['Offline mode is limited', 'Complex permissions on free tier'],
        features: ['Vector Networks', 'Auto Layout', 'Prototyping', 'FigJam'],
        userReviews: []
    },
    {
        id: 5,
        name: 'Notion',
        niche: 'productivity',
        category: 'Workspace',
        rating: 4.6,
        reviewsCount: 1500,
        description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
        priceModel: 'Freemium',
        deal: '$10 Credit on Sign up',
        tags: ['notes', 'organization', 'chaos'],
        featured: false,
        logoColor: 'bg-gray-800',
        pros: ['Extremely flexible', 'Clean minimalist UI', 'Database functionality'],
        cons: ['Mobile app can be slow', 'No offline mode', 'Steep learning curve'],
        features: ['Wikis', 'Kanban Boards', 'Calendar View', 'AI Assistant'],
        userReviews: []
    },
    {
        id: 6,
        name: 'Ahrefs',
        niche: 'marketing',
        category: 'SEO',
        rating: 4.7,
        reviewsCount: 2200,
        description: 'Everything you need to rank higher & get more traffic.',
        priceModel: 'Subscription',
        deal: '',
        tags: ['seo', 'backlinks', 'traffic'],
        featured: false,
        logoColor: 'bg-blue-600',
        pros: ['Best backlink data in industry', 'Great UI/UX', 'Content Explorer is powerful'],
        cons: ['No free trial', 'Credit based system limits usage'],
        features: ['Site Explorer', 'Keywords Explorer', 'Content Explorer', 'Rank Tracker'],
        userReviews: []
    }
];

export const INITIAL_GLOSSARY = [
    {
        id: 'g1',
        term: 'SEO',
        fullTerm: 'Search Engine Optimization',
        niche: 'marketing',
        definition: 'The process of improving the quality and quantity of website traffic to a website or a web page from search engines.',
        relatedProductIds: [2, 6]
    },
    {
        id: 'g2',
        term: 'API',
        fullTerm: 'Application Programming Interface',
        niche: 'development',
        definition: 'A set of definitions and protocols for building and integrating application software.',
        relatedProductIds: [3]
    },
    {
        id: 'g3',
        term: 'Vector Graphics',
        fullTerm: '',
        niche: 'design',
        definition: 'Computer graphics images that are defined in terms of points on a Cartesian plane, which are connected by lines and curves.',
        relatedProductIds: [4]
    },
    {
        id: 'g4',
        term: 'CRM',
        fullTerm: 'Customer Relationship Management',
        niche: 'marketing',
        definition: 'Technology for managing all your company\'s relationships and interactions with customers and potential customers.',
        relatedProductIds: [1]
    },
    {
        id: 'g5',
        term: 'Kanban',
        fullTerm: '',
        niche: 'productivity',
        definition: 'A visual method for managing work as it moves through a process. Kanban visualizes both the process (the workflow) and the actual work passing through that process.',
        relatedProductIds: [5]
    }
];
