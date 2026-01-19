import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

function EmblaSlide({ title, description, index }) {
  return (
    <div className="min-w-0 pl-6 flex-[0_0_100%] md:flex-[0_0_33.333%]">
      {/* CARD CONTAINER */}
      <div className="h-full flex flex-col rounded-3xl border border-white/10 bg-[#222222] p-8 transition-all duration-300 hover:border-teal-200/50 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-teal-900/10">
        {/* HEADER: Badge + Line */}
        <div className="mb-6 flex items-center">
          {/* Number Badge */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-200 text-sm font-bold text-black">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* The Horizontal Line */}
          <div className="ml-4 h-px flex-1 bg-teal-200/50"></div>
        </div>

        {/* CONTENT */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {title.replace(/^\d+\s*/, "")}
          </h2>
          <p className="text-base text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmblaCarousel({ slides }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6 cursor-grab active:cursor-grabbing">
          {slides.map((slide, index) => (
            <EmblaSlide
              key={index}
              title={slide.title}
              description={slide.description}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mt-8 flex justify-end gap-4 pr-6 md:pr-0">
        <button
          onClick={scrollPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#222222] text-white transition-all hover:border-teal-200 hover:text-teal-200 hover:bg-[#1a1a1a]"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#222222] text-white transition-all hover:border-teal-200 hover:text-teal-200 hover:bg-[#1a1a1a]"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
