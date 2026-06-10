"use client";

import type { ComponentProps } from "react";
import {
  WHATSAPP_URL,
  trackMetaContact,
  type WhatsAppContactTracking,
} from "@/lib/meta-pixel";

type WhatsAppLinkProps = ComponentProps<"a"> & {
  trackingCategory: string;
  trackingVariant?: WhatsAppContactTracking["content_name"];
  href?: string;
};

export function WhatsAppLink({
  trackingCategory,
  trackingVariant = "inline_link",
  href = WHATSAPP_URL,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  children,
  ...props
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={(e) => {
        trackMetaContact({
          content_name: trackingVariant,
          content_category: trackingCategory,
        });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
