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
      let opened = false;
      const openOnce = () => {
        if (opened) return;
        opened = true;
        window.open(href, "_blank");
      };

      // Fallback in case the conversion beacon is blocked (ad blockers,
      // slow network) and event_callback never fires.
      window.setTimeout(openOnce, 1000);

      window.gtag("event", "conversion", {
        send_to: CONVERSION_SEND_TO,
        event_callback: openOnce,
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
