"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TrackedPlayCtaProps {
  placement: "hero" | "footer";
  ariaLabel?: string;
  className?: string;
  badgeWidth?: number;
  badgeHeight?: number;
  imgClassName?: string;
}

export function TrackedPlayCta({
  placement,
  ariaLabel = "Get ScamGuard: Link Checker on Google Play",
  className = "inline-flex transition-transform hover:-translate-y-0.5",
  badgeWidth = 180,
  badgeHeight = 60,
  imgClassName = "h-14 w-auto"
}: TrackedPlayCtaProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const impressionFired = useRef<boolean>(false);
  const [targetHref, setTargetHref] = useState<string>(`/go/scamguard-play?placement=${placement}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentParams = new URLSearchParams(window.location.search);
      const params = new URLSearchParams();
      params.set("placement", placement);
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
        const val = currentParams.get(key);
        if (val) params.set(key, val);
      }
      setTargetHref(`/go/scamguard-play?${params.toString()}`);
    }
  }, [placement]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || impressionFired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !impressionFired.current) {
            impressionFired.current = true;
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "scamguard_cta_impression", {
                placement,
                page_location: window.location.href
              });
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [placement]);

  function handleClick() {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "scamguard_download_click", {
        placement,
        page_location: window.location.href
      });
    }
  }

  return (
    <a
      ref={containerRef}
      href={targetHref}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <Image
        src="/images/google-play-badge.svg"
        alt="Get it on Google Play"
        width={badgeWidth}
        height={badgeHeight}
        className={imgClassName}
      />
    </a>
  );
}
