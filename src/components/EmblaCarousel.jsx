import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

function EmblaSlide({ title, description, index }) {
  return (
    <div className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%] min-w-0 bg-neutral-800 border border-neutral-700 rounded-2xl flex flex-col text-white p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-200/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center text-black font-bold text-sm mr-4 shadow-lg">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="h-px bg-teal-200 flex-1"></div>
      </div>
      <h2 className="text-xl font-bold mb-4 text-white group-hover:text-teal-200 transition-colors duration-300">{title.replace(/^\d+\s*/, '')}</h2>
      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{description}</p>
      <div className="mt-auto pt-6">
        <div className="h-1 bg-teal-200 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </div>
  );
}

export default function EmblaCarousel({ slides }) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
  });

  return (
    <div className="embla relative">
      <div className="embla__viewport overflow-hidden rounded-xl pr-4 md:pr-8" ref={emblaRef}>
        <div className="embla__container flex flex-row gap-6 will-change-transform cursor-grab active:cursor-grabbing">
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
    </div>
  );
}
