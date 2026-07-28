"use server";

// ============================================================
// Admin authentication is DISABLED — the /admin dashboard is
// open to anyone with the URL. This was a deliberate choice
// since only the site owner is expected to use it.
//
// To turn the password gate back on later:
// 1. Restore the password-checking logic below (see git history
//    or ask for it to be re-added).
// 2. Set ADMIN_PASSWORD in your environment variables.
// 3. Point app/admin/page.tsx back at <AdminLoginForm />.
// ============================================================

export async function adminLogin(
  _password: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function adminLogout() {
  // No-op — there is no session to clear.
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return true;
}
