import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  children: ReactNode;
};

export function LegalPageShell({
  title,
  subtitle,
  effectiveDate,
  children,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-ivory">
      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-sm text-charcoal/70">{subtitle}</p>
        ) : null}
        {effectiveDate ? (
          <p className="mt-2 text-xs text-charcoal/60">
            Effective Date: {effectiveDate}
          </p>
        ) : null}
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-charcoal/80 [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-charcoal first:[&_h2]:mt-0 [&_h3]:mb-1 [&_h3]:mt-7 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-charcoal [&_h4]:mb-0.5 [&_h4]:mt-5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-charcoal [&_ul]:my-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-charcoal [&_a]:underline [&_a]:underline-offset-2 [&_table]:w-full [&_table]:text-sm [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-charcoal">
          {children}
        </div>
      </article>
    </main>
  );
}
