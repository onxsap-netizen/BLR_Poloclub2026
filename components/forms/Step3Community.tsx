"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { step3Schema, type Step3Data } from "@/lib/formSchema";
import { FieldLabel, FieldError, TextInput, TextArea, RadioPills } from "./FormFields";
import { FileUpload } from "./FileUpload";

export default function Step3Community({
  defaultValues,
  defaultInsurance,
  onNext,
  onBack,
}: {
  defaultValues: Partial<Step3Data>;
  defaultInsurance: File | null;
  onNext: (data: Step3Data, insuranceFile: File | null) => void;
  onBack: () => void;
}) {
  const [insuranceFile, setInsuranceFile] = useState<File | null>(defaultInsurance);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      previous_club: "no",
      ever_removed: "no",
      has_insurance: "no",
      ...defaultValues,
    },
  });

  const previousClub = watch("previous_club");
  const everRemoved = watch("ever_removed");
  const hasInsurance = watch("has_insurance");

  const submit = (data: Step3Data) => onNext(data, insuranceFile);

  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-2xl font-bold uppercase">About You</h3>
        <p className="mt-1 text-sm text-silver">Help us understand who you are as a member.</p>
      </div>

      <div>
        <FieldLabel required>What made you join ThePoloClub.BLR?</FieldLabel>
        <TextArea placeholder="Tell us what drew you to the community..." {...register("why_join")} />
        <FieldError message={errors.why_join?.message} />
      </div>

      <div>
        <FieldLabel required>Tell us your story with your Polo</FieldLabel>
        <TextArea placeholder="How did you get your Polo? What does it mean to you?" {...register("polo_story")} />
        <FieldError message={errors.polo_story?.message} />
      </div>

      <div>
        <FieldLabel>Have you previously been part of another automobile club?</FieldLabel>
        <RadioPills
          name="previous_club"
          value={previousClub}
          onChange={(v) => setValue("previous_club", v as "yes" | "no")}
          options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
        />
      </div>

      {previousClub === "yes" && (
        <div>
          <FieldLabel>Please explain</FieldLabel>
          <TextInput placeholder="Which club, and for how long?" {...register("previous_club_details")} />
        </div>
      )}

      <div>
        <FieldLabel>Have you ever been removed from any community?</FieldLabel>
        <RadioPills
          name="ever_removed"
          value={everRemoved}
          onChange={(v) => setValue("ever_removed", v as "yes" | "no")}
          options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>Emergency Contact Name</FieldLabel>
          <TextInput placeholder="Full name" {...register("emergency_contact_name")} />
          <FieldError message={errors.emergency_contact_name?.message} />
        </div>
        <div>
          <FieldLabel required>Emergency Contact Number</FieldLabel>
          <TextInput placeholder="+91 98765 43210" {...register("emergency_contact_number")} />
          <FieldError message={errors.emergency_contact_number?.message} />
        </div>
      </div>

      <div>
        <FieldLabel>Vehicle Insurance Available?</FieldLabel>
        <RadioPills
          name="has_insurance"
          value={hasInsurance}
          onChange={(v) => setValue("has_insurance", v as "yes" | "no")}
          options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
        />
      </div>

      {hasInsurance === "yes" && (
        <div className="max-w-[160px]">
          <FileUpload label="Upload Insurance" onFileSelect={setInsuranceFile} accept="image/*,.pdf" />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="focus-ring rounded-full border border-silver/40 px-9 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-silver-light hover:border-off hover:text-off"
        >
          Back
        </button>
        <button
          type="submit"
          className="focus-ring rounded-full bg-accent px-9 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02]"
        >
          Continue to Rules
        </button>
      </div>
    </motion.form>
  );
}
