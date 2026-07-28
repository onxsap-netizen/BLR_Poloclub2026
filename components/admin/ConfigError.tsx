import { AlertTriangle } from "lucide-react";

export default function ConfigError({ message }: { message: string }) {
  return (
    <div className="carbon-bg flex min-h-screen items-center justify-center px-5">
      <div className="glass max-w-lg rounded-2xl p-8 text-center">
        <AlertTriangle className="mx-auto text-accent" size={40} />
        <h1 className="mt-4 font-display text-2xl font-bold uppercase">
          Supabase Not Configured
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-silver">{message}</p>
        <div className="mt-6 rounded-xl border border-base-border bg-base-elevated p-4 text-left text-xs text-silver-light">
          <p className="font-display font-semibold uppercase tracking-wider text-accent">
            To fix this:
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4">
            <li>
              Go to your Supabase project → Settings → API and copy the Project URL,
              anon key, and service_role key.
            </li>
            <li>
              In Netlify: Site configuration → Environment variables — add
              NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and
              SUPABASE_SERVICE_ROLE_KEY.
            </li>
            <li>
              Trigger a new deploy (env var changes only apply on the next build).
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
