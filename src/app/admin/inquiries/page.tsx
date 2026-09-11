import { createClient } from "@/lib/supabase/server";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import type { PartnershipInquiry } from "@/lib/types";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partnership_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const inquiries = (data ?? []) as PartnershipInquiry[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Partnership inquiries</h1>

      <div className="mt-6 flex flex-col gap-3">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="mw-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{inquiry.org_name}</p>
                <p className="text-xs text-muted">
                  {inquiry.contact_name ? `${inquiry.contact_name} · ` : ""}
                  {inquiry.email}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(inquiry.created_at).toLocaleString()}
                </p>
              </div>
              <InquiryStatusSelect id={inquiry.id} status={inquiry.status} />
            </div>
            {inquiry.message && <p className="mt-3 text-sm text-muted">{inquiry.message}</p>}
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-muted">No inquiries yet.</p>}
      </div>
    </div>
  );
}
