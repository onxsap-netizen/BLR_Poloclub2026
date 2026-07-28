import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Car, Flag, Award } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Member } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMember(id: string): Promise<Member | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as Member;
  } catch {
    return null;
  }
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  return (
    <section className="carbon-bg relative min-h-screen pb-24 pt-32 md:pt-40">
      <div className="absolute inset-0 bg-red-glow opacity-40" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 md:px-8">
        <div className="glass rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-accent/40">
              {member.car_photo_url ? (
                <Image
                  src={member.car_photo_url}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-base-elevated">
                  <Car className="text-silver" size={32} />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">
                {member.full_name}
              </h1>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-silver sm:justify-start">
                <MapPin size={15} className="text-accent" /> {member.city}
              </p>
              <p className="mt-2 font-display text-sm uppercase tracking-wider text-accent">
                {member.polo_variant}
              </p>
            </div>
          </div>

          {member.story && (
            <div className="mt-8 border-t border-base-border pt-6">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-silver-light">
                Their Story
              </h2>
              <p className="mt-2 leading-relaxed text-silver">{member.story}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-base-border pt-6 sm:grid-cols-2">
            <div className="rounded-xl border border-base-border bg-base-panel p-5 text-center">
              <Flag className="mx-auto text-accent" size={22} />
              <p className="mt-2 font-mono text-2xl font-bold">{member.drives_attended}</p>
              <p className="text-xs uppercase tracking-wider text-silver">Drives Attended</p>
            </div>
            <div className="rounded-xl border border-base-border bg-base-panel p-5 text-center">
              <Award className="mx-auto text-accent" size={22} />
              <p className="mt-2 font-mono text-2xl font-bold">{member.badges?.length || 0}</p>
              <p className="text-xs uppercase tracking-wider text-silver">Badges Earned</p>
            </div>
          </div>

          {member.badges && member.badges.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
              {member.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-accent"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-xs uppercase tracking-widest text-silver/60 sm:text-left">
            Member since {new Date(member.joined_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </section>
  );
}
