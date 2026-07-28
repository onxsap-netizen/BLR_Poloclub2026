import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Sheets sync error: GOOGLE_SHEETS_WEBHOOK_URL is not set");
    return NextResponse.json(
      { success: false, error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const data = await req.json();

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "follow",
    });

    const bodyText = await res.text();

    if (!res.ok) {
      console.error("Sheets sync error: Apps Script responded", res.status, bodyText);
      return NextResponse.json(
        { success: false, error: `Apps Script returned ${res.status}`, detail: bodyText },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, detail: bodyText });
  } catch (err) {
    console.error("Sheets sync error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
