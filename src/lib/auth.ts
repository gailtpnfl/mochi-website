import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AppUser } from "@/lib/types";

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  return (data as AppUser) ?? null;
});

export async function requireAdmin(): Promise<AppUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
