"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { step2Schema, type Step2Data } from "@/lib/formSchema";
import { FieldLabel, FieldError, TextInput, Select, RadioPills } from "./FormFields";
import { FileUpload } from "./FileUpload";

export interface CarPhotos {
  front: File | null;
  rear: File | null;
  side: File | null;
  interior: File | null;
}

export default function Step2CarDetails({
  defaultValues,
  defaultPhotos,
  onNext,
  onBack,
}: {
  defaultValues: Partial<Step2Data>;
  defaultPhotos: CarPhotos;
  onNext: (data: Step2Data, photos: CarPhotos) => void;
  onBack: () => void;
}) {
  const [photos, setPhotos] = useState<CarPhotos>(defaultPhotos);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { is_modified: "no", ...defaultValues },
  });

  const isModified = watch("is_modified");

  const submit = (data: Step2Data) => onNext(data, photos);

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
        <h3 className="font-display text-2xl font-bold uppercase">Your Polo</h3>
        <p className="mt-1 text-sm text-silver">Tell us about the car you drive.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>Polo Variant</FieldLabel>
          <Select {...register("polo_variant")} defaultValue="">
            <option value="" disabled>Select variant</option>
            <option value="Polo Trendline">Polo Trendline</option>
            <option value="Polo Comfortline">Polo Comfortline</option>
            <option value="Polo Highline">Polo Highline</option>
            <option value="Polo GT TSI">Polo GT TSI</option>
            <option value="Polo GT TDI">Polo GT TDI</option>
            <option value="Polo GTI">Polo GTI</option>
            <option value="Other">Other</option>
          </Select>
          <FieldError message={errors.polo_variant?.message} />
        </div>
        <div>
          <FieldLabel required>Year</FieldLabel>
          <TextInput placeholder="e.g. 2019" {...register("car_year")} />
          <FieldError message={errors.car_year?.message} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>Transmission</FieldLabel>
          <Select {...register("transmission")} defaultValue="">
            <option value="" disabled>Select transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic (AT)">Automatic (AT)</option>
            <option value="DSG">DSG</option>
          </Select>
          <FieldError message={errors.transmission?.message} />
        </div>
        <div>
          <FieldLabel required>Fuel Type</FieldLabel>
          <Select {...register("fuel_type")} defaultValue="">
            <option value="" disabled>Select fuel type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </Select>
          <FieldError message={errors.fuel_type?.message} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>Car Colour</FieldLabel>
          <TextInput placeholder="e.g. Carbon Steel Grey" {...register("car_colour")} />
          <FieldError message={errors.car_colour?.message} />
        </div>
        <div>
          <FieldLabel required>Registration Number</FieldLabel>
          <TextInput placeholder="e.g. KA 01 AB 1234" className="plate-number" {...register("registration_number")} />
          <FieldError message={errors.registration_number?.message} />
        </div>
      </div>

      <div>
        <FieldLabel>Upload Car Photos</FieldLabel>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FileUpload label="Front" onFileSelect={(f) => setPhotos((p) => ({ ...p, front: f }))} />
          <FileUpload label="Rear" onFileSelect={(f) => setPhotos((p) => ({ ...p, rear: f }))} />
          <FileUpload label="Side" onFileSelect={(f) => setPhotos((p) => ({ ...p, side: f }))} />
          <FileUpload label="Interior" onFileSelect={(f) => setPhotos((p) => ({ ...p, interior: f }))} />
        </div>
      </div>

      <div>
        <FieldLabel>Is your car modified?</FieldLabel>
        <RadioPills
          name="is_modified"
          value={isModified}
          onChange={(v) => setValue("is_modified", v as "yes" | "no")}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </div>

      {isModified === "yes" && (
        <div>
          <FieldLabel>Modification Details</FieldLabel>
          <TextInput placeholder="e.g. Remap, exhaust, coilovers..." {...register("modification_details")} />
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
          Continue
        </button>
      </div>
    </motion.form>
  );
}
