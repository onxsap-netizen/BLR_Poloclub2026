import { redirect } from "next/navigation";

// The dashboard now lives directly at /admin. This route just
// forwards old bookmarks/links there.
export default function DashboardRedirect() {
  redirect("/admin");
}
