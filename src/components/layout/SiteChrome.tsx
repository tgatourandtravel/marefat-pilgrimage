"use client";

import type { ReactNode } from "react";
import { StickyBarProvider } from "@/contexts/StickyBarContext";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SiteHeader } from "./SiteHeader";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <StickyBarProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FloatingWhatsApp />
    </StickyBarProvider>
  );
}
