"use client";

import React, { useState } from "react";
import { Product } from "../../data/products";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

interface PlanSlideProps {
  product: Product;
}

const PlanSlide: React.FC<PlanSlideProps> = ({ product }) => {
  const { setPlan } = useCart();
  const router = useRouter();
  const [paymentOption, setPaymentOption] = useState<"monthly" | "annual">("monthly");

  const handlePurchase = () => {
    const selectedPrice =
      paymentOption === "annual"
        ? product.totalAnnualPrice
        : product.monthlyPrice;

    setPlan(product.name, selectedPrice, paymentOption);
    router.push("/cart");
  };

  return (
    <div className="mt-10 w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT COLUMN */}
        <div className="flex-1 border-b-4 lg:border-b-0 lg:border-r-4 border-gray-300 pb-8 lg:pb-0 lg:pr-8">
          
          <h2 className="text-xl font-bold text-center mb-6">
            Membership Information - {product.name}
          </h2>

          {/* Icons Row */}
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { src: "/icons/video-icon.jpg", label: "Play Our Video" },
              { src: "/icons/website-icon.png", label: "See Our Website" },
              { src: "/icons/portfolio-icon.png", label: "Visit Our Portfolio" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <img src={item.src} className="w-12 h-12 object-contain" />
                <span className="text-sm mt-2 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-base">
            All the <span className="font-bold">legal assistance</span> your business needs.
          </p>

          {/* Feature List */}
          <ul className="flex flex-col gap-3 mt-6 max-w-md mx-auto">
            {[
              ["tick-icon.png", "Legal Advice Consultations"],
              ["tick-icon.png", "Contract Drafting"],
              ["tick-icon.png", "Contract Reviewing"],
              ["tick-icon.png", "Contract Amendments"],
              ["tick-icon.png", "Domestic Trade Mark Applications"],
              ["tick-icon.png", "Employment and HR Support"],
              ["cross-icon.png", "Business Structuring Assistance"],
              ["cross-icon.png", "Business Tools and Legal Templates"],
              ["tick-icon.png", "50% off hourly rates"],
            ].map(([icon, text], i) => (
              <li key={i} className="flex items-center gap-3">
                <img src={`/icons/${icon}`} className="w-5 h-5" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col gap-6">
          
          <h2 className="text-xl font-bold text-center">
            Payment Information
          </h2>

          {/* Price */}
          <div className="text-3xl font-extrabold text-center">
            {new Intl.NumberFormat("en-AU", {
              style: "currency",
              currency: "AUD",
            }).format(product.monthlyPrice)}
            <span className="block text-lg font-normal mt-3">
              Monthly Membership Fee
            </span>
          </div>

          {/* Contact Options */}
          <div className="border-y-4 border-gray-300 py-6">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
              
              <div className="flex items-center gap-4 cursor-pointer">
                <img src="/icons/phone-icon.png" className="w-10 h-10" />
                <span>Speak To Our Team</span>
              </div>

              <div className="flex items-center gap-4 cursor-pointer">
                <img src="/icons/chat-icon.jpg" className="w-10 h-10" />
                <span>Chat With Our Team</span>
              </div>

            </div>
          </div>

          {/* Payment Options */}
          <div className="text-center">
            <span className="font-semibold">
              Select a payment option below:
            </span>

            <div className="flex justify-center gap-16 mt-4">
              {["monthly", "annual"].map((option) => (
                <div
                  key={option}
                  onClick={() => setPaymentOption(option as any)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <span className="capitalize">{option} Fee</span>
                  <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                    {paymentOption === option && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="space-y-4 mt-4">
            
            <div className="flex justify-between items-center border-b-4 border-gray-300 pb-3">
              <span className="font-semibold">Annual Cost</span>
              <div className="flex gap-10">
                <span>
                  {new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                  }).format(product.totalMonthlyPrice)}
                </span>
                <span>
                  {new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                  }).format(product.totalAnnualPrice)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b-4 border-gray-300 pb-3">
              <span className="font-semibold">Your Savings</span>
              <div className="flex gap-10">
                <span>
                  {new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                  }).format(product.totalMonthlySavings)}
                </span>
                <span>
                  {new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                  }).format(product.totalMonthlySavings)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold">12-Month Contract</span>
              <div className="flex gap-10">
                <img src="/icons/tick-icon.png" className="w-8 h-8" />
                <img src="/icons/cross-icon.png" className="w-8 h-8" />
              </div>
            </div>

          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            className="mt-6 py-3 px-6 bg-[#002a25] text-white rounded-full hover:bg-green-700 transition w-fit mx-auto"
          >
            Purchase Membership
          </button>

        </div>
      </div>
    </div>
  );
};

export default PlanSlide;