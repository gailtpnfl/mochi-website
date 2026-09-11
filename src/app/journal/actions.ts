"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { journalEntrySchema } from "@/lib/validations";

type ActionState = { error?: string; ok?: boolean } | undefined;

function num(value: string | number | "") {
  if (value === "" || value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export async function saveJournalEntry(
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in required." };

  const parsed = journalEntrySchema.safeParse({
    traded_at: formData.get("traded_at"),
    symbol: formData.get("symbol"),
    direction: formData.get("direction"),
    entry_price: formData.get("entry_price") || "",
    exit_price: formData.get("exit_price") || "",
    stop_price: formData.get("stop_price") || "",
    size: formData.get("size") || "",
    leverage: formData.get("leverage") || "",
    margin: formData.get("margin") || "",
    r_multiple: formData.get("r_multiple") || "",
    outcome: formData.get("outcome"),
    screenshot_url: formData.get("screenshot_url") || "",
    notes_md: formData.get("notes_md") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    traded_at: parsed.data.traded_at,
    symbol: parsed.data.symbol.toUpperCase(),
    direction: parsed.data.direction,
    entry_price: num(parsed.data.entry_price ?? ""),
    exit_price: num(parsed.data.exit_price ?? ""),
    stop_price: num(parsed.data.stop_price ?? ""),
    size: num(parsed.data.size ?? ""),
    leverage: num(parsed.data.leverage ?? ""),
    margin: num(parsed.data.margin ?? ""),
    r_multiple: num(parsed.data.r_multiple ?? ""),
    outcome: parsed.data.outcome,
    screenshot_url: parsed.data.screenshot_url || null,
    notes_md: parsed.data.notes_md || null,
  };

  const { error } = id
    ? await supabase.from("journal_entries").update(payload).eq("id", id).eq("user_id", user.id)
    : await supabase.from("journal_entries").insert(payload);

  if (error) return { error: "Could not save entry." };

  revalidatePath("/journal");
  return { ok: true };
}

export async function deleteJournalEntry(id: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/journal");
}

export async function shareEntryToReview(entryId: string, cohortId: string, title: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in required." };

  const supabase = await createClient();
  const { data: review, error: reviewError } = await supabase
    .from("trade_reviews")
    .insert({ cohort_id: cohortId, user_id: user.id, title })
    .select("id")
    .single();

  if (reviewError || !review) return { error: "Could not create the review. Are you in this cohort?" };

  const { error: linkError } = await supabase
    .from("journal_entries")
    .update({ shared_review_id: review.id })
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (linkError) return { error: "Could not share this entry." };

  revalidatePath("/journal");
  return { ok: true };
}
