import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().url("Must be a valid image URL").or(z.string().startsWith("/uploads/")).optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  breaking: z.boolean().default(false),
  scheduledAt: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().default(""),
  order: z.number().int().default(0),
});

export const tagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR"]),
  active: z.boolean().default(true),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  tagline: z.string().default(""),
  breakingEnabled: z.boolean().default(true),
  breakingCustomText: z.string().default(""),
  breakingUrl: z.string().default(""),
  contactEmail: z.string().email().or(z.literal("")).default(""),
  twitterUrl: z.string().default(""),
  facebookUrl: z.string().default(""),
  youtubeUrl: z.string().default(""),
  newsletterHeadline: z.string().default(""),
  newsletterDescription: z.string().default(""),
});
