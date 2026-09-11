"use client";

import { useTransition } from "react";
import { updateInquiryStatus } from "@/lib/actions/admin";
import type { InquiryStatus } from "@/lib/types";

export function InquiryStatusSelect({ id, status }: { id: string; status: InquiryStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as InquiryStatus;
        startTransition(() => {
          updateInquiryStatus(id, next);
        });
      }}
      className="input w-auto py-1 text-xs"
    >
      <option value="new">New</option>
      <option value="in_talks">In talks</option>
      <option value="closed">Closed</option>
    </select>
  );
}
