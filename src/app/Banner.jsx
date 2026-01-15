"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Banner() {

  

 
    
  return (
    <div className="w-full overflow-hidden">
      <div
        className="
      relative
      w-full
      aspect-video
      md:aspect-21/9
    "
      >
        <Image
          src="/banner5.jpg"
          alt="Luxury jewellery campaign banner"
          fill
          priority
          className="
        object-cover
        object-center
      "
        />
      </div>
    </div>
  );
}
