export type UserRole = "member" | "admin";
export type AirdropStatus = "upcoming" | "live" | "ended";
export type InquiryStatus = "new" | "in_talks" | "closed";

export interface AppUser {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  discord_id: string | null;
  discord_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  created_at: string;
}

export interface Airdrop {
  id: string;
  slug: string;
  title: string;
  chain: string | null;
  status: AirdropStatus;
  is_featured: boolean;
  summary: string | null;
  guide_md: string | null;
  external_url: string | null;
  partner_id: string | null;
  cover_image_url: string | null;
  is_archived: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  partner?: Partner | null;
}

export interface GuideRevision {
  id: string;
  airdrop_id: string;
  guide_md: string;
  edited_by: string | null;
  created_at: string;
}

/** Rank in the /team org chart. Ordering here drives the order of the sections. */
export const TEAM_TIERS = [
  "founder",
  "leadership",
  "trading_manager",
  "director",
  "moderator",
] as const;

export type TeamTier = (typeof TEAM_TIERS)[number];

export interface TeamMember {
  id: string;
  display_name: string;
  /** Community handle / in-game name, shown under the real name. */
  ign: string | null;
  role_title: string;
  tier: TeamTier;
  bio_md: string | null;
  avatar_url: string | null;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    discord?: string;
  };
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body_md: string;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface PartnershipInquiry {
  id: string;
  org_name: string;
  contact_name: string | null;
  email: string;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description_md: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  module_title: string | null;
  video_url: string | null;
  content_md: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export type ToolAccess = "public" | "members" | "mentees";
export type ToolType = "calculator" | "indicator" | "watchlist" | "journal" | "page";

export interface TradingTool {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tool_type: ToolType;
  access: ToolAccess;
  asset_url: string | null;
  position: number;
}

export type WatchlistStatus = "watching" | "active" | "closed";

export interface WatchlistItem {
  id: string;
  symbol: string;
  exchange: string | null;
  thesis_md: string | null;
  status: WatchlistStatus;
  added_by: string | null;
  added_at: string;
  closed_at: string | null;
}

export type CohortStatus = "upcoming" | "active" | "completed";

export interface Cohort {
  id: string;
  name: string;
  description_md: string | null;
  status: CohortStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "waitlisted";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface CohortApplication {
  id: string;
  cohort_id: string;
  user_id: string;
  motivation_md: string | null;
  experience_level: ExperienceLevel | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  cohort?: Cohort;
}

export type CohortMemberRole = "mentee" | "mentor";

export interface CohortMember {
  id: string;
  cohort_id: string;
  user_id: string;
  role: CohortMemberRole;
  joined_at: string;
}

export interface MentorshipSession {
  id: string;
  cohort_id: string;
  title: string;
  description_md: string | null;
  scheduled_at: string;
  duration_minutes: number;
  location_url: string | null;
  created_at: string;
}

export type TradeReviewStatus = "submitted" | "reviewed";

export interface TradeReview {
  id: string;
  cohort_id: string;
  user_id: string;
  reviewed_by: string | null;
  title: string;
  submission_md: string | null;
  feedback_md: string | null;
  status: TradeReviewStatus;
  created_at: string;
  updated_at: string;
}

export type JournalDirection = "long" | "short";
export type JournalOutcome = "win" | "loss" | "breakeven" | "open";

export interface JournalEntry {
  id: string;
  user_id: string;
  traded_at: string;
  symbol: string;
  direction: JournalDirection;
  entry_price: number | null;
  exit_price: number | null;
  stop_price: number | null;
  size: number | null;
  leverage: number | null;
  margin: number | null;
  r_multiple: number | null;
  outcome: JournalOutcome | null;
  screenshot_url: string | null;
  notes_md: string | null;
  shared_review_id: string | null;
  created_at: string;
  updated_at: string;
}

export type JobType = "full_time" | "part_time" | "contract" | "volunteer";
export type JobStatus = "open" | "closed";

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  org: string;
  type: JobType;
  location: string;
  description_md: string | null;
  apply_url: string | null;
  status: JobStatus;
  posted_at: string;
}

export interface NftCollection {
  id: string;
  slug: string;
  name: string;
  description_md: string | null;
  chain: string | null;
  cover_image_url: string | null;
  marketplace_url: string | null;
  artist: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NftItem {
  id: string;
  collection_id: string;
  name: string | null;
  image_url: string;
  position: number;
}
