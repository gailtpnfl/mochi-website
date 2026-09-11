import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validations";
import { emailProvider } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });

  // 23505 = unique_violation: already subscribed, treat as success rather than
  // erroring. A plain insert (not upsert) because RLS only grants public INSERT
  // on this table, not SELECT — `.upsert()` needs SELECT on the conflict target.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }

  await emailProvider.sendNewsletterWelcome(parsed.data.email);

  return NextResponse.json({ ok: true });
}
