import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | Marefat Pilgrimage",
  description:
    "Terms and Conditions for TGA Tour and Travel LLC (DBA Marefat Pilgrimage) travel services.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      subtitle="TGA Tour and Travel LLC — Doing Business As: Marefat Pilgrimage"
      effectiveDate="March 11, 2026"
    >
      <TermsContent />
    </LegalPageShell>
  );
}
