import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

function EmblaSlide({ title, description }) {
  return (
    <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.3333%] min-w-0 bg-teal-200 rounded-2xl flex flex-col text-black p-8 shadow-lg">
      <h2 className="text-2xl mb-2">{title}</h2>
      <p className="text-base">{description}</p>
    </div>
  );
}

export default function EmblaCarousel({ slides }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container flex flex-row gap-4 will-change-transform cursor-grab active:cursor-grabbing">
        {slides.map((slide, idx) => (
          <EmblaSlide key={idx} title={slide.title} description={slide.description} />
        ))}
      </div>
    </div>
  );
}
