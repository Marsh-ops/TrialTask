"use client";

import React, { useState } from "react";
import { Product } from "../../data/products";
import { useRouter } from "next/navigation";
import { useCart } from '@/components/CartContext';

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
    router.push('/cart');
    };

  return (
    <div className="mt-10 w-full max-w-1600 mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
      
        {/* Column Divider */}
        <div className="flex flex-col gap-4 pr-1 border-r-4 border-gray-300 flex-1">

        {/* Left Column - Membership Information */}
        <h2 className="text-xl font-bold text-center">
            Membership Information - {product.name}
        </h2>

        {/* Row of 3 icons + labels */}
        <div className="flex gap-8 mt-2">
            
        <div className="flex flex-col items-center pl-60">
        <img src="/icons/video-icon.jpg" alt="Icon 1" className="w-15 h-12" />
        <span className="text-sm mt-1 text-center">Play Our Video</span>
        </div>

        <div className="flex flex-col items-center">
        <img src="/icons/website-icon.png" alt="Icon 2" className="w-15 h-12" />
        <span className="text-sm mt-1 text-center">See Our Website</span>
        </div>

        <div className="flex flex-col items-center">
        <img src="/icons/portfolio-icon.png" alt="Icon 3" className="w-15 h-12" />
        <span className="text-sm mt-1 text-center">Visit Our Portfolio</span>
        </div>
    </div>

        {/* Supporting text */}
        <p className="mt-4 text-center text-base">
        All the <span className="font-bold">legal assistance</span> your business needs.
        </p>

        {/* Feature list */}
        <ul className="flex flex-col gap-2 mt-4 pl-60">
          <li className="flex items-center gap-2 mt-2">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Legal Advice Consultations
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Contract Drafting
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Contract Reviewing
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Contract Amendments
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Domestic Trade Mark Applications
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            Employment and HR Support
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/cross-icon.png" alt="Icon 3" className="w-5 h-5" />
            Business Structuring Assistance
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/cross-icon.png" alt="Icon 3" className="w-5 h-5" />
            Business Tools and Legal Templates
          </li>
          <li className="flex items-center gap-2 mt-4">
            <img src="/icons/tick-icon.png" alt="Icon 3" className="w-5 h-5" />
            50% off hourly rates
          </li>
        </ul>
      </div>

      {/* Right Column - Payment Information */}
      <div className="flex flex-col gap-4 flex-1">
        <h2 className="text-xl font-bold text-center">Payment Information</h2>

        {/* Price */}
        <div className="text-3xl font-extrabold text-center">
        {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.monthlyPrice)}
        <span className="block text-lg font-normal mt-4">
            Monthly Membership Fee
        </span>
        </div>

        {/* Contact options with horizontal lines */}
        <div className="flex flex-col gap-2 mt-4">

        {/* Top horizontal line */}
        <div className="border-t-4 border-gray-300"></div>

        {/* Contact Options */}
        <div className="flex items-center gap-10 py-2 pl-20">

        {/* Speak To Our Team */}
        <div className="flex items-center gap-8 cursor-pointer">
            <img src="/icons/phone-icon.png" alt="Phone Icon" className="w-10 h-10" />
            <span className="text-black">Speak To Our Team</span>
        </div>

        {/* Chat With Our Team */}
        <div className="flex items-center gap-8 cursor-pointer pl-55">
            <img src="/icons/chat-icon.jpg" alt="Chat Icon" className="w-10 h-10" />
            <span className="text-black">Chat With Our Team</span>
        </div>
        </div>

        {/* Bottom horizontal line */}
        <div className="border-b-4 border-gray-300"></div>
        </div>

        {/* Payment Options */}
        <div className="mt-4 flex flex-col gap-3">
        <span className="font-semibold text-center">
            Select a payment option below:
        </span>

        <div className="flex justify-center gap-12">

            {/* Monthly TICKBOX*/}
            <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => setPaymentOption("monthly")}
            >
            <span>Monthly Fee</span>
            <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                {paymentOption === "monthly" && (
                <span className="text-green-600 font-bold">✓</span>
                )}
            </div>
            </div>

            {/* Annual TICKBOX*/}
            <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => setPaymentOption("annual")}
            >
            <span>Annual Fee</span>
            <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                {paymentOption === "annual" && (
                <span className="text-green-600 font-bold">✓</span>
                )}
            </div>
            </div>

        </div>
        </div>

       {/* Totals aligned with tick boxes */}
        <div className="mt-4 flex flex-col gap-3 w-full">

        {/* Annual Cost */}
        <div className="flex items-center w-full">
            <span className="font-semibold mr-6 pl-10">Annual Cost</span>
            <div className="flex justify-center gap-16 flex-1 -ml-35">
            <span>{new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.totalMonthlyPrice)}</span>
            <span>{new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.totalAnnualPrice)}</span>
            </div>
        </div>
        <div className="border-b-4 border-gray-300"></div>

        {/* Your Savings */}
        <div className="flex items-center w-full">
            <span className="font-semibold mr-6 pl-10">Your Savings</span>
            <div className="flex justify-center gap-16 flex-1 -ml-38">
            <span>{new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.totalMonthlySavings)}</span>
            <span>{new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.totalMonthlySavings)}</span>
            </div>
        </div>
        <div className="border-b-4 border-gray-300"></div>

        {/* 12-Month Contract */}
        <div className="flex items-center w-full">
            <span className="font-semibold mr-6">12-Month Contract</span>
            <div className="flex justify-center gap-30 flex-1 -ml-40">
            <img src="/icons/tick-icon.png" alt="Monthly Contract" className="w-8 h-8" />
            <img src="/icons/cross-icon.png" alt="Annual Contract" className="w-8 h-8" />
            </div>
        </div>

        </div>

          {/* Purchase Button */}
          <button
            className="mt-4 py-3 px-6 bg-[#002a25] text-white rounded-full hover:bg-green-700 transition w-max mx-auto block"
            onClick={handlePurchase}
          >
            Purchase Membership
          </button>
        </div>
      </div>
      </div>
  );
};

export default PlanSlide;