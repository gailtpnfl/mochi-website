import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { TradeReviewCard } from "@/components/admin/trade-review-card";

interface TradeReviewRow {
  id: string;
  title: string;
  submission_md: string | null;
  feedback_md: string | null;
  status: "submitted" | "reviewed";
  reviewed_by: string | null;
  user: { display_name: string | null } | null;
}

export default async function AdminTradeReviewsPage() {
  const admin = await getCurrentUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("trade_reviews")
    .select(
      "id, title, submission_md, feedback_md, status, reviewed_by, user:users!trade_reviews_user_id_fkey(display_name)",
    )
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as unknown as TradeReviewRow[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Trade reviews</h1>
      <p className="mt-2 text-sm text-muted">
        Shared journal entries from members. Take a review to give feedback.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {reviews.map((review) => (
          <TradeReviewCard
            key={review.id}
            id={review.id}
            title={review.title}
            submitterName={review.user?.display_name ?? "Unknown"}
            submissionMd={review.submission_md}
            feedbackMd={review.feedback_md}
            status={review.status}
            reviewedByMe={review.reviewed_by === admin!.id}
            currentAdminId={admin!.id}
          />
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted">No trade reviews submitted yet.</p>}
      </div>
    </div>
  );
}
