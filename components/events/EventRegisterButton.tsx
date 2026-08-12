"use client";

import { useState } from "react";
import RegisterDialog from "./RegisterDialog";

type Props = {
  title: string;
  slug?: string;
  date?: string;
  location?: string;
  className?: string;
};

export default function EventRegisterButton({
  title,
  slug,
  date,
  location,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          "mt-4 w-full rounded-full bg-red-600 py-2.5 text-xs font-bold tracking-widest text-white transition hover:bg-red-500 " +
          className
        }
      >
        REGISTER &amp; JOIN GROUP
      </button>

      <RegisterDialog
        event={{ title, slug, date, location }}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
