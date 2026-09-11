"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, getCurrentUser } from "@/lib/auth";
import {
  airdropSchema,
  teamMemberSchema,
  announcementSchema,
  courseSchema,
  lessonSchema,
  watchlistItemSchema,
  cohortSchema,
  sessionSchema,
  tradeReviewFeedbackSchema,
  jobPostingSchema,
  nftCollectionSchema,
  nftItemSchema,
} from "@/lib/validations";
import type { ApplicationStatus } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

function fieldsFromForm(formData: FormData, keys: string[]) {
  const result: Record<string, FormDataEntryValue | null> = {};
  for (const key of keys) result[key] = formData.get(key);
  return result;
}

// ---------------------------------------------------------------------------
// Airdrops
// ---------------------------------------------------------------------------

export async function saveAirdrop(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "slug",
    "title",
    "chain",
    "status",
    "summary",
    "guide_md",
    "external_url",
    "partner_id",
    "cover_image_url",
  ]);

  const parsed = airdropSchema.safeParse({
    slug: raw.slug,
    title: raw.title,
    chain: raw.chain,
    status: raw.status,
    is_featured: formData.get("is_featured") === "on",
    summary: raw.summary,
    guide_md: raw.guide_md,
    external_url: raw.external_url,
    partner_id: raw.partner_id,
    cover_image_url: raw.cover_image_url,
    is_archived: formData.get("is_archived") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    chain: parsed.data.chain || null,
    status: parsed.data.status,
    is_featured: parsed.data.is_featured,
    summary: parsed.data.summary || null,
    guide_md: parsed.data.guide_md || null,
    external_url: parsed.data.external_url || null,
    partner_id: parsed.data.partner_id || null,
    cover_image_url: parsed.data.cover_image_url || null,
    is_archived: parsed.data.is_archived,
  };

  let airdropId = id;

  if (id) {
    const { error } = await supabase.from("airdrops").update(payload).eq("id", id);
    if (error) return { error: "Could not save airdrop." };
  } else {
    const { data, error } = await supabase
      .from("airdrops")
      .insert({ ...payload, created_by: admin.id })
      .select("id")
      .single();
    if (error || !data) return { error: "Could not create airdrop." };
    airdropId = data.id as string;
  }

  if (payload.guide_md && airdropId) {
    await supabase.from("guide_revisions").insert({
      airdrop_id: airdropId,
      guide_md: payload.guide_md,
      edited_by: admin.id,
    });
  }

  revalidatePath("/admin/airdrops");
  revalidatePath("/airdrops");
  redirect("/admin/airdrops");
}

export async function deleteAirdrop(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("airdrops").delete().eq("id", id);
  revalidatePath("/admin/airdrops");
  revalidatePath("/airdrops");
}

// ---------------------------------------------------------------------------
// Team members
// ---------------------------------------------------------------------------

export async function saveTeamMember(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "display_name",
    "ign",
    "role_title",
    "tier",
    "bio_md",
    "avatar_url",
    "twitter",
    "instagram",
    "linkedin",
    "discord",
    "position",
  ]);

  const parsed = teamMemberSchema.safeParse({
    ...raw,
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    display_name: parsed.data.display_name,
    ign: parsed.data.ign || null,
    role_title: parsed.data.role_title,
    tier: parsed.data.tier,
    bio_md: parsed.data.bio_md || null,
    avatar_url: parsed.data.avatar_url || null,
    socials: {
      twitter: parsed.data.twitter || undefined,
      instagram: parsed.data.instagram || undefined,
      linkedin: parsed.data.linkedin || undefined,
      discord: parsed.data.discord || undefined,
    },
    position: parsed.data.position,
    is_active: parsed.data.is_active,
  };

  const { error } = id
    ? await supabase.from("team_members").update(payload).eq("id", id)
    : await supabase.from("team_members").insert(payload);

  if (error) return { error: "Could not save team member." };

  revalidatePath("/admin/team");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

export async function saveAnnouncement(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, ["title", "body_md"]);
  const isPublished = formData.get("is_published") === "on";

  const parsed = announcementSchema.safeParse({
    title: raw.title,
    body_md: raw.body_md,
    is_published: isPublished,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    title: parsed.data.title,
    body_md: parsed.data.body_md,
    is_published: parsed.data.is_published,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
  };

  const { error } = id
    ? await supabase.from("announcements").update(payload).eq("id", id)
    : await supabase.from("announcements").insert({ ...payload, created_by: admin.id });

  if (error) return { error: "Could not save announcement." };

  revalidatePath("/admin/announcements");
  revalidatePath("/community");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("announcements").delete().eq("id", id);
  revalidatePath("/admin/announcements");
  revalidatePath("/community");
}

// ---------------------------------------------------------------------------
// Partnership inquiries
// ---------------------------------------------------------------------------

export async function updateInquiryStatus(id: string, status: "new" | "in_talks" | "closed") {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("partnership_inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
}

// ---------------------------------------------------------------------------
// Courses & lessons
// ---------------------------------------------------------------------------

export async function saveCourse(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, ["slug", "title", "description_md", "cover_image_url", "position"]);
  const parsed = courseSchema.safeParse({
    ...raw,
    is_published: formData.get("is_published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    description_md: parsed.data.description_md || null,
    cover_image_url: parsed.data.cover_image_url || null,
    is_published: parsed.data.is_published,
    position: parsed.data.position,
  };

  const { error } = id
    ? await supabase.from("courses").update(payload).eq("id", id)
    : await supabase.from("courses").insert(payload);

  if (error) return { error: "Could not save course." };

  revalidatePath("/admin/courses");
  revalidatePath("/learn");
  redirect("/admin/courses");
}

export async function deleteCourse(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("courses").delete().eq("id", id);
  revalidatePath("/admin/courses");
  revalidatePath("/learn");
}

export async function saveLesson(
  courseId: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "slug",
    "title",
    "module_title",
    "video_url",
    "content_md",
    "position",
  ]);
  const parsed = lessonSchema.safeParse({
    ...raw,
    is_published: formData.get("is_published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    course_id: courseId,
    slug: parsed.data.slug,
    title: parsed.data.title,
    module_title: parsed.data.module_title || null,
    video_url: parsed.data.video_url || null,
    content_md: parsed.data.content_md || null,
    position: parsed.data.position,
    is_published: parsed.data.is_published,
  };

  const { error } = id
    ? await supabase.from("lessons").update(payload).eq("id", id)
    : await supabase.from("lessons").insert(payload);

  if (error) return { error: "Could not save lesson." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(courseId: string, id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("lessons").delete().eq("id", id);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

// ---------------------------------------------------------------------------
// Watchlist
// ---------------------------------------------------------------------------

export async function saveWatchlistItem(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, ["symbol", "exchange", "thesis_md", "status"]);
  const parsed = watchlistItemSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    symbol: parsed.data.symbol.toUpperCase(),
    exchange: parsed.data.exchange || null,
    thesis_md: parsed.data.thesis_md || null,
    status: parsed.data.status,
    closed_at: parsed.data.status === "closed" ? new Date().toISOString() : null,
  };

  const { error } = id
    ? await supabase.from("watchlist_items").update(payload).eq("id", id)
    : await supabase.from("watchlist_items").insert({ ...payload, added_by: admin.id });

  if (error) return { error: "Could not save watchlist item." };

  revalidatePath("/admin/watchlist");
  revalidatePath("/tools/watchlist");
  redirect("/admin/watchlist");
}

export async function deleteWatchlistItem(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("watchlist_items").delete().eq("id", id);
  revalidatePath("/admin/watchlist");
  revalidatePath("/tools/watchlist");
}

// ---------------------------------------------------------------------------
// Cohorts (mentorship)
// ---------------------------------------------------------------------------

export async function saveCohort(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, ["name", "description_md", "status", "starts_at", "ends_at"]);
  const parsed = cohortSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    description_md: parsed.data.description_md || null,
    status: parsed.data.status,
    starts_at: parsed.data.starts_at || null,
    ends_at: parsed.data.ends_at || null,
  };

  const { error } = id
    ? await supabase.from("cohorts").update(payload).eq("id", id)
    : await supabase.from("cohorts").insert(payload);

  if (error) return { error: "Could not save cohort." };

  revalidatePath("/admin/cohorts");
  revalidatePath("/mentorship");
  redirect("/admin/cohorts");
}

export async function deleteCohort(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("cohorts").delete().eq("id", id);
  revalidatePath("/admin/cohorts");
  revalidatePath("/mentorship");
}

export async function reviewApplication(id: string, status: ApplicationStatus) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase
    .from("cohort_applications")
    .update({ status, reviewed_by: admin.id, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (status === "accepted") {
    const { data: application } = await supabase
      .from("cohort_applications")
      .select("cohort_id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (application) {
      await supabase
        .from("cohort_members")
        .upsert(
          { cohort_id: application.cohort_id, user_id: application.user_id, role: "mentee" },
          { onConflict: "cohort_id,user_id" },
        );
    }
  }

  revalidatePath("/admin/cohorts");
}

export async function saveSession(
  cohortId: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "title",
    "description_md",
    "scheduled_at",
    "duration_minutes",
    "location_url",
  ]);
  const parsed = sessionSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    cohort_id: cohortId,
    title: parsed.data.title,
    description_md: parsed.data.description_md || null,
    scheduled_at: new Date(parsed.data.scheduled_at).toISOString(),
    duration_minutes: parsed.data.duration_minutes,
    location_url: parsed.data.location_url || null,
  };

  const { error } = id
    ? await supabase.from("sessions").update(payload).eq("id", id)
    : await supabase.from("sessions").insert(payload);

  if (error) return { error: "Could not save session." };

  revalidatePath(`/admin/cohorts/${cohortId}`);
  redirect(`/admin/cohorts/${cohortId}`);
}

export async function deleteSession(cohortId: string, id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("sessions").delete().eq("id", id);
  revalidatePath(`/admin/cohorts/${cohortId}`);
}

export async function assignReviewer(tradeReviewId: string, reviewerId: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("trade_reviews").update({ reviewed_by: reviewerId }).eq("id", tradeReviewId);
  revalidatePath("/admin/trade-reviews");
}

export async function submitReviewFeedback(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized." };

  const parsed = tradeReviewFeedbackSchema.safeParse({ feedback_md: formData.get("feedback_md") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("trade_reviews")
    .update({ feedback_md: parsed.data.feedback_md, status: "reviewed" })
    .eq("id", id);

  if (error) return { error: "Could not save feedback. You may not be the assigned reviewer." };

  revalidatePath("/admin/trade-reviews");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Job postings
// ---------------------------------------------------------------------------

export async function saveJobPosting(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "slug",
    "title",
    "org",
    "type",
    "location",
    "description_md",
    "apply_url",
    "status",
  ]);
  const parsed = jobPostingSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    org: parsed.data.org,
    type: parsed.data.type,
    location: parsed.data.location,
    description_md: parsed.data.description_md || null,
    apply_url: parsed.data.apply_url || null,
    status: parsed.data.status,
  };

  const { error } = id
    ? await supabase.from("job_postings").update(payload).eq("id", id)
    : await supabase.from("job_postings").insert(payload);

  if (error) return { error: "Could not save job posting." };

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function deleteJobPosting(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("job_postings").delete().eq("id", id);
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
}

// ---------------------------------------------------------------------------
// NFT collections
// ---------------------------------------------------------------------------

export async function saveNftCollection(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, [
    "slug",
    "name",
    "description_md",
    "chain",
    "cover_image_url",
    "marketplace_url",
    "artist",
    "position",
  ]);
  const parsed = nftCollectionSchema.safeParse({
    ...raw,
    is_published: formData.get("is_published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    description_md: parsed.data.description_md || null,
    chain: parsed.data.chain || null,
    cover_image_url: parsed.data.cover_image_url || null,
    marketplace_url: parsed.data.marketplace_url || null,
    artist: parsed.data.artist || null,
    position: parsed.data.position,
    is_published: parsed.data.is_published,
  };

  const { error } = id
    ? await supabase.from("nft_collections").update(payload).eq("id", id)
    : await supabase.from("nft_collections").insert(payload);

  if (error) return { error: "Could not save collection." };

  revalidatePath("/admin/nft");
  revalidatePath("/nft");
  redirect("/admin/nft");
}

export async function deleteNftCollection(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("nft_collections").delete().eq("id", id);
  revalidatePath("/admin/nft");
  revalidatePath("/nft");
}

export async function saveNftItem(
  collectionId: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const raw = fieldsFromForm(formData, ["name", "image_url", "position"]);
  const parsed = nftItemSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();
  const payload = {
    collection_id: collectionId,
    name: parsed.data.name || null,
    image_url: parsed.data.image_url,
    position: parsed.data.position,
  };

  const { error } = id
    ? await supabase.from("nft_items").update(payload).eq("id", id)
    : await supabase.from("nft_items").insert(payload);

  if (error) return { error: "Could not save item." };

  revalidatePath(`/admin/nft/${collectionId}`);
  revalidatePath("/nft");
  redirect(`/admin/nft/${collectionId}`);
}

export async function deleteNftItem(collectionId: string, id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("nft_items").delete().eq("id", id);
  revalidatePath(`/admin/nft/${collectionId}`);
  revalidatePath("/nft");
}
