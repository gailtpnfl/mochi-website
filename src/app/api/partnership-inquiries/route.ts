import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { partnershipInquirySchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = partnershipInquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("partnership_inquiries").insert({
    org_name: parsed.data.org_name,
    contact_name: parsed.data.contact_name || null,
    email: parsed.data.email,
    message: parsed.data.message || null,
  });

  if (error) {
    return NextResponse.json({ error: "Could not submit your inquiry right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
