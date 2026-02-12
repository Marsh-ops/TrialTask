// app/plans/page.tsx
import React from "react";
import MembershipPlansCarousel from "@/components/Membership/MembershipCarousel";
import { products } from "@/data/products";

const PlansPage = () => {
  return (
    <div className="py-10 bg-gray-50 min-h-screen flex flex-col items-center w-full">
    <h1 className="text-3xl font-bold text-center mb-8"></h1>
    <div className="w-full px-4 md:px-8">
      <MembershipPlansCarousel products={products} />
    </div>
  </div>
  );
};

export default PlansPage;