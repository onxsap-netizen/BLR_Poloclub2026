import { z } from "zod";

export const step1Schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  phone_number: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  city: z.string().min(2, "Enter your city"),
  occupation: z.string().min(2, "Enter your occupation"),
});

export const step2Schema = z.object({
  polo_variant: z.string().min(1, "Select a variant"),
  car_year: z.string().min(4, "Enter the model year"),
  transmission: z.string().min(1, "Select transmission"),
  fuel_type: z.string().min(1, "Select fuel type"),
  car_colour: z.string().min(1, "Enter car colour"),
  registration_number: z.string().min(4, "Enter registration number"),
  is_modified: z.enum(["yes", "no"]),
  modification_details: z.string().optional(),
});

export const step3Schema = z.object({
  why_join: z.string().min(10, "Tell us a bit more (min 10 characters)"),
  polo_story: z.string().min(10, "Tell us a bit more (min 10 characters)"),
  previous_club: z.enum(["yes", "no"]),
  previous_club_details: z.string().optional(),
  ever_removed: z.enum(["yes", "no"]),
  emergency_contact_name: z.string().min(2, "Required"),
  emergency_contact_number: z.string().min(10, "Enter a valid number"),
  has_insurance: z.enum(["yes", "no"]),
});

export const step4Schema = z.object({
  rules_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Code of Conduct" }),
  }),
});

export const fullApplicationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type FullApplicationData = z.infer<typeof fullApplicationSchema>;
