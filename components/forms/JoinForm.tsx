"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StepProgress } from "./StepProgress";
import Step1Personal from "./Step1Personal";
import Step2CarDetails, { type CarPhotos } from "./Step2CarDetails";
import Step3Community from "./Step3Community";
import Step4Rules from "./Step4Rules";
import type { Step1Data, Step2Data, Step3Data } from "@/lib/formSchema";

type FormState = Partial<Step1Data & Step2Data & Step3Data>;

async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export default function JoinForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({});
  const [photos, setPhotos] = useState<CarPhotos>({ front: null, rear: null, side: null, interior: null });
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const supabase = createClient();

      const [frontUrl, rearUrl, sideUrl, interiorUrl, insuranceUrl] = await Promise.all([
        photos.front ? uploadFile(supabase, "car-photos", photos.front) : null,
        photos.rear ? uploadFile(supabase, "car-photos", photos.rear) : null,
        photos.side ? uploadFile(supabase, "car-photos", photos.side) : null,
        photos.interior ? uploadFile(supabase, "car-photos", photos.interior) : null,
        insuranceFile ? uploadFile(supabase, "insurance-docs", insuranceFile) : null,
      ]);

      const { error } = await supabase.from("applications").insert({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email: formData.email,
        city: formData.city,
        occupation: formData.occupation,
        polo_variant: formData.polo_variant,
        car_year: formData.car_year,
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        car_colour: formData.car_colour,
        registration_number: formData.registration_number,
        photo_front_url: frontUrl,
        photo_rear_url: rearUrl,
        photo_side_url: sideUrl,
        photo_interior_url: interiorUrl,
        is_modified: formData.is_modified === "yes",
        modification_details: formData.modification_details || null,
        why_join: formData.why_join,
        polo_story: formData.polo_story,
        previous_club: formData.previous_club === "yes",
        previous_club_details: formData.previous_club_details || null,
        ever_removed: formData.ever_removed === "yes",
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_number: formData.emergency_contact_number,
        has_insurance: formData.has_insurance === "yes",
        insurance_url: insuranceUrl,
        rules_accepted: true,
        status: "pending",
      });

     if (error) throw error;

      // Also sync to Google Sheet (fire-and-forget, doesn't block success)
      fetch("/api/sheets-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          email: formData.email,
          city: formData.city,
          occupation: formData.occupation,
          polo_variant: formData.polo_variant,
          car_year: formData.car_year,
          transmission: formData.transmission,
          fuel_type: formData.fuel_type,
          car_colour: formData.car_colour,
          registration_number: formData.registration_number,
          is_modified: formData.is_modified === "yes",
          modification_details: formData.modification_details || "",
          why_join: formData.why_join,
          polo_story: formData.polo_story,
          previous_club: formData.previous_club === "yes",
          ever_removed: formData.ever_removed === "yes",
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_number: formData.emergency_contact_number,
          has_insurance: formData.has_insurance === "yes",
          status: "pending",
        }),
      }).catch((err) => console.error("Sheet sync failed:", err));

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `Something went wrong: ${err.message}. Please try again.`
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass mx-auto max-w-xl rounded-2xl p-10 text-center"
      >
        <CheckCircle2 className="mx-auto text-accent" size={56} />
        <h3 className="mt-6 font-display text-3xl font-bold uppercase">Application Submitted</h3>
        <p className="mt-3 text-silver">
          Thank you for applying to ThePoloClub.BLR. Our team will review your
          application and get back to you via email or phone within 5-7 days.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <StepProgress current={step} />
      <div className="glass rounded-2xl p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Personal
              key="s1"
              defaultValues={formData}
              onNext={(data) => {
                setFormData((f) => ({ ...f, ...data }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <Step2CarDetails
              key="s2"
              defaultValues={formData}
              defaultPhotos={photos}
              onNext={(data, p) => {
                setFormData((f) => ({ ...f, ...data }));
                setPhotos(p);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3Community
              key="s3"
              defaultValues={formData}
              defaultInsurance={insuranceFile}
              onNext={(data, ins) => {
                setFormData((f) => ({ ...f, ...data }));
                setInsuranceFile(ins);
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Rules
              key="s4"
              onSubmit={handleFinalSubmit}
              onBack={() => setStep(3)}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
