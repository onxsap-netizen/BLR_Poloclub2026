export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: string;
  created_at: string;
  status: ApplicationStatus;

  // Step 1 — Personal Details
  full_name: string;
  phone_number: string;
  email: string;
  city: string;
  occupation: string;

  // Step 2 — Car Details
  polo_variant: string;
  car_year: string;
  transmission: string;
  fuel_type: string;
  car_colour: string;
  registration_number: string;
  photo_front_url: string | null;
  photo_rear_url: string | null;
  photo_side_url: string | null;
  photo_interior_url: string | null;
  is_modified: boolean;
  modification_details: string | null;

  // Step 3 — Community Questions
  why_join: string;
  polo_story: string;
  previous_club: boolean;
  previous_club_details: string | null;
  ever_removed: boolean;
  emergency_contact_name: string;
  emergency_contact_number: string;
  has_insurance: boolean;
  insurance_url: string | null;

  // Step 4
  rules_accepted: boolean;

  // Admin
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  category: string;
  description: string;
  event_date: string;
  event_time: string | null;
  location: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  is_published: boolean;
}

export interface Member {
  id: string;
  application_id: string;
  full_name: string;
  city: string;
  car_photo_url: string | null;
  polo_variant: string;
  story: string;
  drives_attended: number;
  badges: string[];
  joined_at: string;
}

export interface GalleryPhoto {
  id: string;
  created_at: string;
  url: string;
  caption: string;
  sort_order: number;
}
