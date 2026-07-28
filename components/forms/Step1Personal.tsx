"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { step1Schema, type Step1Data } from "@/lib/formSchema";
import { FieldLabel, FieldError, TextInput } from "./FormFields";

export default function Step1Personal({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<Step1Data>;
  onNext: (data: Step1Data) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-2xl font-bold uppercase">Personal Details</h3>
        <p className="mt-1 text-sm text-silver">Tell us a little about yourself.</p>
      </div>

      <div>
        <FieldLabel required>Full Name</FieldLabel>
        <TextInput placeholder="e.g. Arjun Mehta" {...register("full_name")} />
        <FieldError message={errors.full_name?.message} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <TextInput placeholder="+91 98765 43210" {...register("phone_number")} />
          <FieldError message={errors.phone_number?.message} />
        </div>
        <div>
          <FieldLabel required>Email</FieldLabel>
          <TextInput type="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel required>City</FieldLabel>
          <TextInput placeholder="e.g. Bengaluru" {...register("city")} />
          <FieldError message={errors.city?.message} />
        </div>
        <div>
          <FieldLabel required>Occupation</FieldLabel>
          <TextInput placeholder="e.g. Product Designer" {...register("occupation")} />
          <FieldError message={errors.occupation?.message} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="focus-ring rounded-full bg-accent px-9 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-off transition-transform hover:scale-[1.02]"
        >
          Continue to Car Details
        </button>
      </div>
    </motion.form>
  );
}
