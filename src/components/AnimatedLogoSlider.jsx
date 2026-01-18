import React, { useState, useEffect } from "react";
import "./AnimatedLogoSlider.css";

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

const VISIBLE_COUNT = 3;
const ANIMATION_DURATION = 800;
const PAUSE_DURATION = 1200;

export default function AnimatedLogoSlider() {
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setStartIdx((prev) => (prev + VISIBLE_COUNT) % logos.length);
        setAnimating(false);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION + PAUSE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const currentLogos = Array.from({ length: VISIBLE_COUNT }).map(
    (_, i) => logos[(startIdx + i) % logos.length],
  );

  const nextLogos = Array.from({ length: VISIBLE_COUNT }).map(
    (_, i) => logos[(startIdx + VISIBLE_COUNT + i) % logos.length],
  );

  return (
    <>
      <div className="logo-slider-row">
        {currentLogos.map((current, i) => {
          const incoming = nextLogos[i];
          return (
            <div
              key={`slot-${i}`}
              className="logo-slot"
              style={{ width: `${100 / VISIBLE_COUNT}%` }}
            >
              {/* CURRENT LOGO */}
              <div className={`logo-slide ${animating ? "up" : "active"}`}>
                <div
                  className="logo-tint"
                  style={{
                    WebkitMaskImage: `url(${current.src})`,
                    maskImage: `url(${current.src})`,
                  }}
                >
                  <img
                    src={current.src}
                    alt={current.alt}
                    className={`logo-img ${current.className || ""}`}
                  />
                </div>
              </div>

              {/* INCOMING LOGO */}
              {animating && (
                <div className="logo-slide down">
                  <div
                    className="logo-tint"
                    style={{
                      WebkitMaskImage: `url(${incoming.src})`,
                      maskImage: `url(${incoming.src})`,
                    }}
                  >
                    <img
                      src={incoming.src}
                      alt={incoming.alt}
                      className={`logo-img ${incoming.className || ""}`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Keep the preloader */}
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
