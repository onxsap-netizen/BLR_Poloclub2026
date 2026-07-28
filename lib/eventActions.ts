"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { Event } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getAdminEvents(): Promise<Event[]> {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Event[];
}

export interface EventInput {
  title: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  is_published: boolean;
}

export async function createEvent(
  input: EventInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").insert(input).select("id").single();
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/events");
  return { success: true, id: data.id };
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/events");
  return { success: true };
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/events");
  return { success: true };
}

export async function uploadEventImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const file = formData.get("file") as File | null;
  if (!file) return { success: false, error: "No file provided" };

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("event-images")
    .upload(path, arrayBuffer, { contentType: file.type });
  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from("event-images").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
