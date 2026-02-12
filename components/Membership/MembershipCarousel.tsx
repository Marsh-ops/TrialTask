"use client";

import React, { useState } from "react";
import { Product } from "../../data/products";
import PlanSlide from "./PlanSlide";

interface MembershipPlansCarouselProps {
  products: Product[];
}

const MembershipPlansCarousel: React.FC<MembershipPlansCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  // Map product names to colors
  const membershipColors: Record<string, string> = {
    Bronze: "#f59e0b",
    Silver: "#cbd5e1",
    Gold: "#fde047",
  };

  const barColor = membershipColors[products[currentIndex].name] || "bg-gray-500/60";

  return (
    <>
      {/* Grey Bar */}
      <div className="relative w-10/12 max-w-1600 h-14 bg-gray-500/60 flex items-center justify-center mx-auto rounded-md">

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-6 w-8 h-8 rounded-full bg-[#002a25] text-white shadow-lg hover:bg-[#004d40] flex items-center justify-center"
          style={{ backgroundColor: barColor }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Membership Name */}
        <span className="text-white font-bold text-lg absolute">{products[currentIndex].name}</span>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-6 w-8 h-8 rounded-full bg-[#002a25] text-white shadow-lg hover:bg-[#004d40] flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* PlanSlide below grey bar */}
      <div className="mt-7 w-full max-w-1600 mx-auto">
        <PlanSlide product={products[currentIndex]} />
      </div>
    </>
  );
};

export default MembershipPlansCarousel;