"use client";

import { useActionState } from "react";
import { saveTeamMember } from "@/lib/actions/admin";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { TEAM_TIERS, type TeamMember, type TeamTier } from "@/lib/types";

type ActionState = { error?: string; ok?: boolean } | undefined;

const TIER_LABELS: Record<TeamTier, string> = {
  founder: "Founder",
  leadership: "Leadership",
  trading_manager: "Trading Manager",
  director: "Director of Community",
  moderator: "Community Moderator",
};

export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const boundAction = saveTeamMember.bind(null, member?.id ?? null);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name *">
          <input name="display_name" required defaultValue={member?.display_name} className="input" />
        </Field>
        <Field label="IGN / handle">
          <input
            name="ign"
            defaultValue={member?.ign ?? ""}
            placeholder="e.g. BigDaddyDaks"
            className="input"
          />
        </Field>
        <Field label="Role title *">
          <input name="role_title" required defaultValue={member?.role_title} className="input" />
        </Field>
        <Field label="Tier * (which /team section)">
          <select name="tier" required defaultValue={member?.tier ?? "moderator"} className="input">
            {TEAM_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {TIER_LABELS[tier]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Avatar URL">
          <input name="avatar_url" defaultValue={member?.avatar_url ?? ""} className="input" />
        </Field>
        <Field label="Position (order)">
          <input
            type="number"
            name="position"
            defaultValue={member?.position ?? 0}
            className="input"
          />
        </Field>
        <Field label="Twitter">
          <input name="twitter" defaultValue={member?.socials.twitter ?? ""} className="input" />
        </Field>
        <Field label="Instagram">
          <input name="instagram" defaultValue={member?.socials.instagram ?? ""} className="input" />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedin" defaultValue={member?.socials.linkedin ?? ""} className="input" />
        </Field>
        <Field label="Discord">
          <input name="discord" defaultValue={member?.socials.discord ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Bio (markdown)">
        <MarkdownEditor name="bio_md" defaultValue={member?.bio_md ?? ""} rows={6} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={member?.is_active ?? true} />
        Active (visible on /team)
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save team member"}
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
