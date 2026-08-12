import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/publicData";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { name, phone, car } = await req.json();

  if (typeof name !== "string" || name.trim().length < 2)
    return NextResponse.json({ error: "Invalid name." }, { status: 400 });
  if (!/^[6-9]\d{9}$/.test(String(phone)))
    return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });

  const events = await getPublishedEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event)
    return NextResponse.json({ error: "Event not found." }, { status: 404 });

  // TODO: persist to your DB / Google Sheet / Airtable here
  // await db.registration.create({ data: { eventSlug: slug, name, phone, car,
  //   acceptedTermsAt: new Date() } });

  return NextResponse.json({ whatsappUrl: event.whatsappUrl ?? null });
}
