"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface DashboardCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function DashboardCarousel({
  children,
  className,
  itemClassName,
}: DashboardCarouselProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const updateState = React.useCallback(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    updateState();
    api.on("select", updateState);
    api.on("reInit", updateState);

    return () => {
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api, updateState]);

  // Handle dynamic content changes
  React.useEffect(() => {
    if (api) {
      setTimeout(() => {
        api.reInit();
        updateState();
      }, 0);
    }
  }, [api, children, updateState]);

  if (!children || children.length === 0) return null;

  return (
    <div className={cn("w-full relative py-2 ", className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          direction: isRTL ? "rtl" : "ltr",
          loop: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="-ml-4 pb-4">
          {children.map((child, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "pl-4 basis-1/2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4",
                itemClassName,
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 min-h-[8px]">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                current === index
                  ? "bg-(--primary) w-6 opacity-100"
                  : "bg-gray-300 w-2 opacity-50 hover:opacity-100",
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
