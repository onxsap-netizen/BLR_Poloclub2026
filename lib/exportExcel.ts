import * as XLSX from "xlsx";
import type { Application } from "./types";

export function exportApplicationsToExcel(applications: Application[], filename = "polo-club-applications.xlsx") {
  const rows = applications.map((a) => ({
    "Full Name": a.full_name,
    Phone: a.phone_number,
    Email: a.email,
    City: a.city,
    Occupation: a.occupation,
    "Polo Variant": a.polo_variant,
    Year: a.car_year,
    Transmission: a.transmission,
    "Fuel Type": a.fuel_type,
    Colour: a.car_colour,
    "Registration No.": a.registration_number,
    Modified: a.is_modified ? "Yes" : "No",
    "Modification Details": a.modification_details || "",
    "Why Join": a.why_join,
    "Polo Story": a.polo_story,
    "Previous Club": a.previous_club ? "Yes" : "No",
    "Ever Removed": a.ever_removed ? "Yes" : "No",
    "Emergency Contact": a.emergency_contact_name,
    "Emergency Number": a.emergency_contact_number,
    "Has Insurance": a.has_insurance ? "Yes" : "No",
    Status: a.status,
    "Admin Notes": a.admin_notes || "",
    "Applied On": new Date(a.created_at).toLocaleString("en-IN"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  XLSX.writeFile(workbook, filename);
}
