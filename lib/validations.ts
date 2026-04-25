import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
});

export const GlossaryTermSchema = z.object({
  id: z.string().optional(),
  term: z.string().min(1, "Term is required"),
  definition: z.string().min(1, "Definition is required"),
  shortDefinition: z.string().optional(),
  category: z.string().optional(),
  niche: z.string().optional(),
  slug: z.string().optional(),
});

export const UserStorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const TestimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  text: z.string().min(1, "Text is required"),
  rating: z.number().min(1).max(5).optional(),
  approved: z.boolean().optional(),
});

export const SubscriberSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const HerbSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  healing: z.array(z.string()).optional(),
  description: z.string().optional(),
  physical: z.string().optional(),
  emotional: z.string().optional(),
  benefits: z.string().optional(),
  usage: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
});

export const AffirmationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  affirmation: z.string().min(1, "Affirmation is required"),
  category: z.string().optional(),
  slug: z.string().optional(),
});

export const FAQSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  h1Title: z.string().optional(),
  deepDive: z.object({
    problem: z.string().optional(),
    methodology: z.string().optional(),
    solution: z.string().optional(),
  }).optional(),
});
