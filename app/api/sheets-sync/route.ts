import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets sync error:", err);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
