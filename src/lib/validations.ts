import { z } from "zod";
import { TEAM_TIERS } from "@/lib/types";

export const newsletterSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }),
});

export const partnershipInquirySchema = z.object({
  org_name: z.string().min(2, { error: "Organization name is required." }).max(200),
  contact_name: z.string().max(200).optional().or(z.literal("")),
  email: z.email({ error: "Please enter a valid email." }),
  message: z.string().min(1, { error: "Message is required." }).max(4000),
});

export const airdropSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Slug must be lowercase letters, numbers, and hyphens." }),
  title: z.string().min(2).max(200),
  chain: z.string().max(50).optional().or(z.literal("")),
  status: z.enum(["upcoming", "live", "ended"]),
  is_featured: z.boolean(),
  summary: z.string().max(500).optional().or(z.literal("")),
  guide_md: z.string().optional().or(z.literal("")),
  external_url: z.url().optional().or(z.literal("")),
  partner_id: z.string().uuid().optional().or(z.literal("")),
  cover_image_url: z.url().optional().or(z.literal("")),
  is_archived: z.boolean(),
});

export const teamMemberSchema = z.object({
  display_name: z.string().min(2).max(200),
  ign: z.string().max(200).optional().or(z.literal("")),
  role_title: z.string().min(2).max(200),
  tier: z.enum(TEAM_TIERS),
  bio_md: z.string().max(4000).optional().or(z.literal("")),
  avatar_url: z.url().optional().or(z.literal("")),
  twitter: z.string().max(200).optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  linkedin: z.string().max(200).optional().or(z.literal("")),
  discord: z.string().max(200).optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export const announcementSchema = z.object({
  title: z.string().min(2).max(200),
  body_md: z.string().min(1),
  is_published: z.boolean(),
});

export const courseSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Slug must be lowercase letters, numbers, and hyphens." }),
  title: z.string().min(2).max(200),
  description_md: z.string().max(2000).optional().or(z.literal("")),
  cover_image_url: z.url().optional().or(z.literal("")),
  is_published: z.boolean(),
  position: z.coerce.number().int().min(0),
});

export const lessonSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Slug must be lowercase letters, numbers, and hyphens." }),
  title: z.string().min(2).max(200),
  module_title: z.string().max(200).optional().or(z.literal("")),
  video_url: z.url().optional().or(z.literal("")),
  content_md: z.string().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});

export const watchlistItemSchema = z.object({
  symbol: z.string().min(1).max(30),
  exchange: z.string().max(50).optional().or(z.literal("")),
  thesis_md: z.string().max(2000).optional().or(z.literal("")),
  status: z.enum(["watching", "active", "closed"]),
});

export const cohortSchema = z.object({
  name: z.string().min(2).max(200),
  description_md: z.string().max(4000).optional().or(z.literal("")),
  status: z.enum(["upcoming", "active", "completed"]),
  starts_at: z.string().optional().or(z.literal("")),
  ends_at: z.string().optional().or(z.literal("")),
});

export const cohortApplicationSchema = z.object({
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  motivation_md: z.string().min(10, { error: "Tell us a bit more (at least 10 characters)." }).max(4000),
});

export const sessionSchema = z.object({
  title: z.string().min(2).max(200),
  description_md: z.string().max(2000).optional().or(z.literal("")),
  scheduled_at: z.string().min(1, { error: "Pick a date and time." }),
  duration_minutes: z.coerce.number().int().min(5).max(600),
  location_url: z.url().optional().or(z.literal("")),
});

export const tradeReviewFeedbackSchema = z.object({
  feedback_md: z.string().min(1).max(4000),
});

export const journalEntrySchema = z.object({
  traded_at: z.string().min(1, { error: "Date is required." }),
  symbol: z.string().min(1).max(30),
  direction: z.enum(["long", "short"]),
  entry_price: z.coerce.number().optional().or(z.literal("")),
  exit_price: z.coerce.number().optional().or(z.literal("")),
  stop_price: z.coerce.number().optional().or(z.literal("")),
  size: z.coerce.number().optional().or(z.literal("")),
  leverage: z.coerce.number().optional().or(z.literal("")),
  margin: z.coerce.number().optional().or(z.literal("")),
  r_multiple: z.coerce.number().optional().or(z.literal("")),
  outcome: z.enum(["win", "loss", "breakeven", "open"]),
  screenshot_url: z.url().optional().or(z.literal("")),
  notes_md: z.string().max(4000).optional().or(z.literal("")),
});

export const jobPostingSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Slug must be lowercase letters, numbers, and hyphens." }),
  title: z.string().min(2).max(200),
  org: z.string().min(1).max(200),
  type: z.enum(["full_time", "part_time", "contract", "volunteer"]),
  location: z.string().min(1).max(200),
  description_md: z.string().max(4000).optional().or(z.literal("")),
  apply_url: z.string().max(500).optional().or(z.literal("")),
  status: z.enum(["open", "closed"]),
});

export const nftCollectionSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { error: "Slug must be lowercase letters, numbers, and hyphens." }),
  name: z.string().min(2).max(200),
  description_md: z.string().max(2000).optional().or(z.literal("")),
  chain: z.string().max(50).optional().or(z.literal("")),
  cover_image_url: z.url().optional().or(z.literal("")),
  marketplace_url: z.url().optional().or(z.literal("")),
  artist: z.string().max(200).optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});

export const nftItemSchema = z.object({
  name: z.string().max(200).optional().or(z.literal("")),
  image_url: z.url({ error: "A valid image URL is required." }),
  position: z.coerce.number().int().min(0),
});
