"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TrackedPlayCtaProps {
  placement: "hero" | "nav" | "footer" | "card";
  href?: string;
  ariaLabel?: string;
  className?: string;
  badgeWidth?: number;
  badgeHeight?: number;
  imgClassName?: string;
}

export function TrackedPlayCta({
  placement,
  href = "https://play.google.com/store/apps/details?id=com.minifyn.censorfyn",
  ariaLabel = "Get CensorFyn on Google Play",
  className = "inline-flex transition-transform hover:-translate-y-0.5",
  badgeWidth = 180,
  badgeHeight = 60,
  imgClassName = "h-14 w-auto"
}: TrackedPlayCtaProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const impressionFired = useRef<boolean>(false);
  const [targetHref, setTargetHref] = useState<string>(href);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const currentParams = new URLSearchParams(window.location.search);
        const destination = new URL(href, window.location.origin);
        destination.searchParams.set("placement", placement);
        for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
          const val = currentParams.get(key);
          if (val) destination.searchParams.set(key, val);
        }
        setTargetHref(destination.toString());
      } catch {
        setTargetHref(href);
      }
    }
  }, [href, placement]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || impressionFired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !impressionFired.current) {
            impressionFired.current = true;
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "censorfyn_cta_impression", {
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
      (window as any).gtag("event", "censorfyn_download_click", {
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
