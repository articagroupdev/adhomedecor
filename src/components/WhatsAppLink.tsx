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
    onClick?.(e);

    // The link opens in a new tab (target="_blank"), so this page never
    // navigates away — there is no race between the redirect and the
    // conversion beacon. We just fire the event and let the browser follow
    // the href natively. `transport_type: 'beacon'` uses navigator.sendBeacon
    // so the hit still completes even if the tab is closed right after.
    if (!e.defaultPrevented && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: CONVERSION_SEND_TO,
        transport_type: "beacon",
      });
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
