import { createClient } from "@supabase/supabase-js";
import type { Event } from "./types";

export async function getPublishedEvents(): Promise<Event[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully return no events if Supabase isn't configured yet,
  // rather than crashing the public Events page.
  if (!url || !key) return [];

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true });
    if (error) {
      console.error("Failed to fetch events:", error.message);
      return [];
    }
    return data as Event[];
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}
