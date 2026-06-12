"use client";

import type { ComponentProps } from "react";
import {
  WHATSAPP_URL,
  trackMetaContactThenNavigate,
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
        e.preventDefault();
        const openLink = () => {
          if (target === "_blank") {
            window.open(href, "_blank", "noopener,noreferrer");
          } else {
            window.location.assign(href);
          }
        };
        trackMetaContactThenNavigate(
          {
            content_name: trackingVariant,
            content_category: trackingCategory,
          },
          openLink
        );
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
