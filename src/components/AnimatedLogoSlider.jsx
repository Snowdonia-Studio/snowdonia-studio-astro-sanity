import React, { useState, useEffect } from "react";
import "./AnimatedLogoSlider.css";
import TEXT from "../constants";

const logos = [
  { src: "/assets/adyen-logo.svg", alt: "Adyen", label: "Adyen" },
  { src: "/assets/algolia-logo.svg", alt: "Algolia", label: "Algolia" },
  { src: "/assets/astro-logo.svg", alt: "Astro", label: "Astro" },
  { src: "/assets/contentful.svg", alt: "Contentful", label: "Contentful" },
  {
    src: "/assets/contentstack-logo.svg",
    alt: "Contentstack",
    label: "Contentstack",
  },
  {
    src: "/assets/cybersource-logo.svg",
    alt: "Cybersource",
    label: "Cybersource",
  },
  { src: "/assets/klaviyo-logo.svg", alt: "Klaviyo", label: "Klaviyo" },
  { src: "/assets/netlify-logo.svg", alt: "Netlify", label: "Netlify" },
  { src: "/assets/nextjs-logo.svg", alt: "Next.js", label: "NEXT.JS" },
  { src: "/assets/paypal-logo.svg", alt: "PayPal", label: "PayPal" },
  {
    src: "/assets/sf-logo.svg",
    alt: "Salesforce",
    label: "Salesforce",
    className: "logo-large",
  },
  { src: "/assets/sanity-logo.svg", alt: "Sanity", label: "Sanity" },
  { src: "/assets/shopify-logo.svg", alt: "Shopify", label: "Shopify" },
  { src: "/assets/vercel-logo.svg", alt: "Vercel", label: "Vercel" },
  {
    src: "/assets/wordpress-logo.svg",
    alt: "WordPress",
    label: "WordPress.com",
  },
  { src: "/assets/yotpo-logo.svg", alt: "Yotpo", label: "Yotpo" },
];

function getVisibleCount() {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 ? 2 : window.innerWidth <= 1168 ? 4 : 5;
  }
  return 6;
}

const ANIMATION_DURATION = 800;
const PAUSE_DURATION = 1200;

export default function AnimatedLogoSlider() {
  const [cycle, setCycle] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    function handleResize() {
      setVisibleCount(getVisibleCount());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setCycle((prev) => prev + 1);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION + PAUSE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const isBufferAActive = cycle % 2 === 0;

  const idxA = isBufferAActive
    ? cycle * visibleCount
    : (cycle + 1) * visibleCount;
  const idxB = !isBufferAActive
    ? cycle * visibleCount
    : (cycle + 1) * visibleCount;

  const getLogos = (startIndex) => {
    return Array.from({ length: visibleCount }).map(
      (_, i) => logos[(startIndex + i) % logos.length],
    );
  };

  const bufferALogos = getLogos(idxA);
  const bufferBLogos = getLogos(idxB);

  return (
    <>
      <div className="logo-slider-row">
        {Array.from({ length: visibleCount }).map((_, i) => {
          return (
            <div
              key={`slot-${i}`}
              className="logo-slot"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <LogoSlide
                logo={bufferALogos[i]}
                state={getSlideState(true, isBufferAActive, animating)}
              />
              <LogoSlide
                logo={bufferBLogos[i]}
                state={getSlideState(false, isBufferAActive, animating)}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          visibility: "hidden",
        }}
      >
        {logos.map((logo) => (
          <img key={logo.label} src={logo.src} alt={logo.label} />
        ))}
      </div>
    </>
  );
}

function getSlideState(isBufferA, isBufferAActive, animating) {
  if (isBufferA) {
    if (isBufferAActive) return animating ? "up" : "active";
    return animating ? "down" : "hidden";
  } else {
    if (!isBufferAActive) return animating ? "up" : "active";
    return animating ? "down" : "hidden";
  }
}

function LogoSlide({ logo, state }) {
  return (
    <div className={`logo-slide ${state}`}>
      <div
        className="logo-tint"
        style={{
          WebkitMaskImage: `url(${logo.src})`,
          maskImage: `url(${logo.src})`,
        }}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className={`logo-img ${logo.className || ""}`}
        />
      </div>
    </div>
  );
}
