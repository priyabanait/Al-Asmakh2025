"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

export default function MotionCarousel({ slides, options = {} }) {
  const containerRef = useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      ...options,
    }
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  return (
    <div className="w-full" ref={containerRef}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index;
            return (
              <div
                key={index}
                className="flex-[0_0_85%] sm:flex-[0_0_75%] min-w-0 px-2"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="h-full"
                >
                  {slide}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pill-style pagination */}
      <div className="flex justify-center gap-2 mt-8">
        {slides.map((_, index) => {
          const isActive = selectedIndex === index;
          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="relative focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className="h-2 rounded-full"
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? "#001730" : "#D1D5DB",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

