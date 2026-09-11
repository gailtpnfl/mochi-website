"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { cohortApplicationSchema } from "@/lib/validations";

type ActionState = { error?: string; ok?: boolean } | undefined;

export async function applyToCohort(
  cohortId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to apply." };

  const parsed = cohortApplicationSchema.safeParse({
    experience_level: formData.get("experience_level"),
    motivation_md: formData.get("motivation_md"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please fill out the form." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("cohort_applications").insert({
    cohort_id: cohortId,
    user_id: user.id,
    experience_level: parsed.data.experience_level,
    motivation_md: parsed.data.motivation_md,
  });

  if (error) {
    if (error.code === "23505") return { error: "You've already applied to this cohort." };
    return { error: "Could not submit your application." };
  }

  revalidatePath("/mentorship");
  return { ok: true };
}
