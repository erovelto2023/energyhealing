# Affirmations Glossary Implementation Plan

## 1. Overview
This plan outlines the creation of an **Affirmations Glossary**, a new core pillar of the Healing Pantry application. These affirmations will act as connective tissue, linking **Herbs**, **Glossary Terms**, and **Products** to provide users with actionable, emotional, and energetic rituals.

The system is designed to be **membership-free** and **publicly accessible**, focusing on SEO and seamless content integration.

---

## 2. Data Architecture

### New Model: `Affirmation`
We will create a specific Mongoose model for Affirmations to allow for structured data and querying.

**Schema Definition:**
```typescript
interface IAffirmation {
    id: string; // Unique identifier (e.g., "aff-123")
    title: string; // E.g., "Rooted Calm"
    slug: string; // URL-friendly, e.g., "rooted-calm"
    affirmation: string; // Main text: "I am grounded..."
    intention: string; // "Supports nervous system..."
    
    // Categorization
    category: string; // Enum: "Nervous System Regulation", "Boundaries", etc.
    
    // Usage Context
    whenToUse: string[]; // ["Morning", "Anxiety"]
    whyItWorks: string; // "Neuroplasticity explanation..."
    userPrompt: string; // Reflection question
    
    // The "Pairing Suggestions" Object
    pairing: {
        herbs: string[]; // Names of herbs textual or linked
        rituals: string[];
        breathwork: string;
        moonPhase: string;
    };
    
    // Relationships (Direct Links)
    primaryHerbId?: string; // Links to IHerb.id
    linkedGlossaryTermIds: string[]; // Links to IGlossaryTerm.id
    recommendedProductIds: number[]; // Links to IProduct.id
    
    // SEO
    metaTitle?: string;
    metaDescription?: string;
    
    isPublished: boolean;
}
```

### Updates to Existing Models (Optional but Recommended)
To enable bi-directional discovery (e.g., seeing affirmations while browsing herbs), we can add reference fields to existing schemas, or rely on querying the Affirmation collection by `primaryHerbId`.

*   **Herb Schema**: Add `relatedAffirmationIds: string[]` (Curated list)
*   **Glossary Schema**: Add `relatedAffirmationIds: string[]` (Curated list)

---

## 3. Integration Logic

### A. The Affirmation "Node"
Each affirmation serves as a hub.
*   **From Herb**: "Pairs with Ashwagandha" -> Link to Herb Page.
*   **From Product**: "Tool: Nervous System Reset Kit" -> Link to Product Page.

### B. Discovery Flow
1.  **Herb Page Integration**:
    *   On the `/healing-pantry/[slug]` page, query for Affirmations where `primaryHerbId` matches the current herb.
    *   Display a "Ritual Pairing" card with the Affirmation.
2.  **Glossary Page Integration**:
    *   On `/glossary/[slug]`, display related Affirmations that link to this concept.
3.  **Product Page Integration**:
    *   On `/products/[slug]`, show "Daily Rituals" using this tool.

---

## 4. UI/UX Plan

### A. Public Pages
1.  **Index Page (`/affirmations`)**:
    *   A clean, calming gallery view.
    *   Filterable by Category (e.g., "Anxiety", "Sleep").
    *   Search bar.
2.  **Detail Page (`/affirmations/[slug]`)**:
    *   **Hero Section**: Large, clean typography of the Affirmation.
    *   **Context**: "Why it works" and "When to use".
    *   **Interaction**: A "Breathe with this" UI element (simple CSS animation).
    *   **Network**: "Paired Herb" card and "Related Concept" links.

### B. Admin Dashboard
1.  **Affirmations Tab**:
    *   List view of all affirmations.
    *   **Create/Edit Form**:
        *   Standard inputs for text fields.
        *   Dropdowns for selecting related Herb, Products, and Glossary terms (searchable).
    *   **Import/Export**: JSON import feature (simpler for bulk content creation).

---

## 5. Development Steps

### Phase 1: Foundation (Backend)
1.  Create `lib/models/Affirmation.ts`.
2.  Create server actions (`lib/actions.ts`) for `getAffirmations`, `createAffirmation`, `updateAffirmation`, `deleteAffirmation`.
3.  Implement `AffirmationForm` component for the Admin DB.

### Phase 2: Public UI
1.  Build `/app/affirmations/page.tsx` (Index).
2.  Build `/app/affirmations/[slug]/page.tsx` (Detail).
3.  Design the `AffirmationCard` component.

### Phase 3: Integration
1.  Update `HealingPantryClient` (Herb view) to fetch and display the linked affirmation.
2.  Update `GlossaryClient` (Glossary view) similarly.
3.  Update `ProductClient`.

### Phase 4: Content Seeding
1.  Create a `initialAffirmations.json` with the starter content provided in the prompt.
2.  Run a seed script to populate the DB.

---

## 6. Design Aesthetic
*   **Typography**: Serif headings (Playfair Display or similar) for the affirmations to give them weight and elegance.
*   **Color**: Soft, calming pastels derived from the linked Herb (if applicable) or the Category theme.
*   **Spacing**: Generous whitespace to allow the user to "breathe" while reading.

## 7. Next Actions
*   Approve this plan.
*   Begin **Phase 1: Foundation**.
