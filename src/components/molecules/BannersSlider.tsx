"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { BannerItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface BannersSliderProps {
  items: BannerItem[];
}

export function BannersSlider({ items }: BannersSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full h-full relative group">
      <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent className="-ml-0 h-full">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-0 h-full">
              <div className="relative w-full h-full overflow-hidden rounded-3xl bg-gray-100 min-h-[200px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Contrast Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                current === index
                  ? "bg-white w-6"
                  : "bg-white/40 w-1.5 hover:bg-white/60"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
