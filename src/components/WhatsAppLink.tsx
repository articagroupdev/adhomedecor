"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONVERSION_SEND_TO = "AW-17865925990/UywGCKn2-tOcEObKkcdC";

type WhatsAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function WhatsAppLink({
  href,
  onClick,
  ...props
}: WhatsAppLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onClick?.(e);

    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: CONVERSION_SEND_TO,
        event_callback: () => {
          window.open(href, "_blank");
        },
      });
    } else {
      window.open(href, "_blank");
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    />
  );
}
