// app/plans/page.tsx
'use client';

import React, { useEffect } from "react";
import MembershipPlansCarousel from "@/components/Membership/MembershipCarousel";
import { products } from "@/data/products";
import { useCart } from "@/components/CartContext";

const PlansPage = () => {
  const { paymentSuccess, setPaymentSuccess } = useCart();

  useEffect(() => {
    if (paymentSuccess) {
      alert('Payment successful!');
      setPaymentSuccess(false); // reset flag
    }
  }, [paymentSuccess, setPaymentSuccess]);

  return (
    <div className="py-10 bg-gray-50 min-h-screen flex flex-col items-center w-full">
      <div className="w-full px-4 md:px-8">
        <MembershipPlansCarousel products={products} />
      </div>
    </div>
  );
};

export default PlansPage;