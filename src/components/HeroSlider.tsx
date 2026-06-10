"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { src: "/img/IMG_0403.JPG.jpeg", alt: "AD Home Decor — wallpanels decorativos" },
  { src: "/img/IMG_0402.JPG.jpeg", alt: "AD Home Decor — decoración de espacios" },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/15" />
    </div>
  );
}
