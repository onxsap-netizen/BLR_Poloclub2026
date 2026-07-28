import { getApplications } from "@/lib/adminActions";
import { getAdminEvents } from "@/lib/eventActions";
import { getAdminGalleryPhotos } from "@/lib/galleryActions";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ConfigError from "@/components/admin/ConfigError";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const [applications, events, galleryPhotos] = await Promise.all([
      getApplications(),
      getAdminEvents(),
      getAdminGalleryPhotos(),
    ]);
    return (
      <AdminDashboard
        initialApplications={applications}
        initialEvents={events}
        initialGalleryPhotos={galleryPhotos}
      />
    );
  } catch (err) {
    return (
      <ConfigError
        message={err instanceof Error ? err.message : "Failed to load dashboard data."}
      />
    );
  }
}
