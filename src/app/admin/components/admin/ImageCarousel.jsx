"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function ImageCarousel({
  images = [],
  alt = "Product image",
  size = "md",
}) {
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const sizeClass =
    {
      sm: "w-[140px]",
      md: "w-[220px]",
      lg: "w-[320px]",
    }[size] || "w-[320px]";

  return (
    <div className="pl-10">
      <Carousel plugins={[autoplay.current]} className={`w-full ${sizeClass}`}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="group relative aspect-square overflow-hidden rounded-xl shadow-md">
                <Image
                  src={image.secure_url}
                  alt={alt}
                  fill
                  priority={index === 0}
                  sizes="300px"
                  className="
                    object-cover
                    transition-transform duration-300 ease-out
                    group-hover:scale-110
                    group-hover:bg-black/5 
                  "
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
