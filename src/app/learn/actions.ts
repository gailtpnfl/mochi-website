"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to track progress." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lesson_progress")
    .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id" });

  if (error) return { error: "Could not save progress." };

  revalidatePath(`/learn/${courseSlug}`);
  return { ok: true };
}
