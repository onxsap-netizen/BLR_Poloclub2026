"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { GalleryPhoto } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getAdminGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as GalleryPhoto[];
}

// Uploads a single file to the gallery-photos bucket and inserts a row.
// Used internally by the bulk upload action below — kept separate so
// each file's success/failure can be reported independently.
async function uploadOnePhoto(
  file: File,
  caption: string,
  sortOrder: number
): Promise<{ success: boolean; photo?: GalleryPhoto; error?: string; fileName: string }> {
  const supabase = createAdminClient();
  const fileName = file.name;

  try {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("gallery-photos")
      .upload(path, arrayBuffer, { contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message, fileName };

    const { data: publicUrlData } = supabase.storage.from("gallery-photos").getPublicUrl(path);

    const { data: row, error: insertError } = await supabase
      .from("gallery_photos")
      .insert({ url: publicUrlData.publicUrl, caption, sort_order: sortOrder })
      .select("*")
      .single();
    if (insertError) return { success: false, error: insertError.message, fileName };

    return { success: true, photo: row as GalleryPhoto, fileName };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown upload error",
      fileName,
    };
  }
}

// Bulk upload: accepts many files at once (from a single <input multiple>
// selection) and uploads them all in parallel, rather than one at a time.
// Returns a per-file result so the UI can show which ones failed without
// losing the ones that succeeded.
export async function bulkUploadGalleryPhotos(
  formData: FormData
): Promise<{
  success: boolean;
  uploaded: GalleryPhoto[];
  failures: { fileName: string; error: string }[];
}> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, uploaded: [], failures: [{ fileName: "", error: "Unauthorized" }] };
  }

  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return { success: false, uploaded: [], failures: [{ fileName: "", error: "No files provided" }] };
  }

  // Base sort_order on current max so new photos append after existing ones.
  const supabase = createAdminClient();
  const { data: maxRow } = await supabase
    .from("gallery_photos")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const startOrder = (maxRow?.sort_order ?? 0) + 1;

  const results = await Promise.all(
    files.map((file, i) => uploadOnePhoto(file, "", startOrder + i))
  );

  const uploaded = results.filter((r) => r.success && r.photo).map((r) => r.photo!) as GalleryPhoto[];
  const failures = results
    .filter((r) => !r.success)
    .map((r) => ({ fileName: r.fileName, error: r.error || "Upload failed" }));

  revalidatePath("/admin/dashboard");
  revalidatePath("/gallery");

  return { success: failures.length === 0, uploaded, failures };
}

export async function updateGalleryPhotoCaption(
  id: string,
  caption: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("gallery_photos").update({ caption }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryPhoto(id: string): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/gallery");
  return { success: true };
}

export async function reorderGalleryPhotos(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) return { success: false, error: "Unauthorized" };
  const supabase = createAdminClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("gallery_photos").update({ sort_order: index }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);
  if (firstError?.error) return { success: false, error: firstError.error.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/gallery");
  return { success: true };
}
