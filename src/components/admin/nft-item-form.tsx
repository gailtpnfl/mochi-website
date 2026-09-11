"use client";

import { useActionState } from "react";
import { saveNftItem } from "@/lib/actions/admin";
import type { NftItem } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function NftItemForm({ collectionId, item }: { collectionId: string; item?: NftItem }) {
  const boundAction = saveNftItem.bind(null, collectionId, item?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={item?.name ?? ""} className="input" />
        </Field>
        <Field label="Position (order)">
          <input type="number" name="position" defaultValue={item?.position ?? 0} className="input" />
        </Field>
      </div>
      <Field label="Image URL *">
        <input name="image_url" required defaultValue={item?.image_url} className="input" />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save item"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
