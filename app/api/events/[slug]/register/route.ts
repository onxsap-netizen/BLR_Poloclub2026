import { NextResponse } from "next/server";

const CLUB_WHATSAPP = "917795980263"; // country code, no +
const COC_VERSION = "2026-08-12";     // bump when you edit the Code of Conduct

export async function POST(req: Request) {
  let body: {
    name?: string;
    phone?: string;
    car?: string;
    eventTitle?: string;
    cocVersion?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
  const car = (body.car ?? "").trim();
  const eventTitle = (body.eventTitle ?? "an upcoming drive").trim();

  if (name.length < 2)
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });

  if (!/^[6-9]\d{9}$/.test(phone))
    return NextResponse.json(
      { error: "Enter a valid 10-digit mobile number." },
      { status: 400 }
    );

  if (body.cocVersion && body.cocVersion !== COC_VERSION)
    return NextResponse.json(
      { error: "The Code of Conduct was updated. Please reload and read it again." },
      { status: 409 }
    );

  // TODO: persist the registration here (Supabase).
  // This is your waiver record — keep the version and timestamp.
  //
  // const supabase = createClient(url, key);
  // await supabase.from("registrations").insert({
  //   event_title: eventTitle,
  //   name,
  //   phone,
  //   car: car || null,
  //   accepted_coc_version: COC_VERSION,
  //   accepted_at: new Date().toISOString(),
  // });

  const message = [
    `Hi ThePoloClub.BLR! I'd like to register for ${eventTitle}.`,
    `Name: ${name}`,
    car ? `Car: ${car}` : null,
    `I have read and accepted the Community Code of Conduct.`,
    `Please add me to the event group.`,
  ]
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({
    whatsappUrl: `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(message)}`,
  });
}
