import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteAnnouncement } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Announcement } from "@/lib/types";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  const announcements = (data ?? []) as Announcement[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Link
          href="/admin/announcements/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New announcement
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {announcements.map((a) => (
          <div key={a.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{a.title}</p>
              <p className="text-xs text-muted">{a.is_published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/admin/announcements/${a.id}/edit`}
                className="text-xs text-muted hover:text-foreground"
              >
                Edit
              </Link>
              <DeleteButton action={deleteAnnouncement.bind(null, a.id)} confirmMessage={`Delete "${a.title}"?`} />
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-sm text-muted">No announcements yet.</p>}
      </div>
    </div>
  );
}
