"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { Application, ApplicationStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getApplications(): Promise<Application[]> {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Application[];
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();

  const { data: app, error: fetchError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !app) return { success: false, error: "Application not found" };

  const { error } = await supabase
    .from("applications")
    .update({
      status,
      admin_notes: notes || null,
      reviewed_by: "admin",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  // On approval, create a member record if one doesn't already exist
  if (status === "approved") {
    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("application_id", id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("members").insert({
        application_id: id,
        full_name: app.full_name,
        city: app.city,
        car_photo_url: app.photo_side_url || app.photo_front_url,
        polo_variant: app.polo_variant,
        story: app.polo_story,
        drives_attended: 0,
        badges: ["New Member"],
      });
    }
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
