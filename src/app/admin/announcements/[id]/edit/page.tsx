import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import type { Announcement } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditAnnouncementPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!announcement) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit announcement</h1>
      <div className="mt-6">
        <AnnouncementForm announcement={announcement as Announcement} />
      </div>
    </div>
  );
}
